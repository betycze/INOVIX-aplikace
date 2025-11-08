from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import os
import glob
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Mount static files for catalog images (accessible via /static/)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client["inovix_portal"]
ratings_collection = db["ratings"]

# Models
class RatingSubmission(BaseModel):
    stars: int
    comment: Optional[str] = ""
    photo: Optional[str] = ""  # base64 encoded
    company: Optional[str] = ""

class RatingResponse(BaseModel):
    id: str
    stars: int
    comment: str
    photo: str
    company: str
    timestamp: str

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "INOVIX Portal API is running"}

@app.post("/api/ratings")
async def submit_rating(rating: RatingSubmission):
    try:
        # Validate stars
        if rating.stars < 1 or rating.stars > 5:
            raise HTTPException(status_code=400, detail="Stars must be between 1 and 5")
        
        # Create rating document
        rating_doc = {
            "stars": rating.stars,
            "comment": rating.comment or "",
            "photo": rating.photo or "",
            "company": rating.company or "",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Insert into database
        result = ratings_collection.insert_one(rating_doc)
        
        return {
            "success": True,
            "message": "Rating submitted successfully",
            "id": str(result.inserted_id)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting rating: {str(e)}")

@app.get("/api/ratings", response_model=List[RatingResponse])
async def get_ratings():
    try:
        ratings = list(ratings_collection.find().sort("timestamp", -1))
        
        return [
            RatingResponse(
                id=str(rating["_id"]),
                stars=rating["stars"],
                comment=rating.get("comment", ""),
                photo=rating.get("photo", ""),
                company=rating.get("company", ""),
                timestamp=rating["timestamp"]
            )
            for rating in ratings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching ratings: {str(e)}")

@app.get("/api/static/catalog/{filename}")
async def serve_catalog_image(filename: str):
    """Serve catalog images under /api/static/ path"""
    file_path = f"static/catalog/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)

@app.get("/api/catalog/images")
async def get_catalog_images():
    """Get list of catalog images in order"""
    try:
        catalog_dir = "static/catalog"
        if not os.path.exists(catalog_dir):
            return {"images": [], "total": 0}
        
        # Get all PNG files and sort them by filename (numbered prefix ensures order)
        image_files = sorted(glob.glob(os.path.join(catalog_dir, "*.png")))
        
        # Create URLs for each image
        images = [
            {
                "id": idx + 1,
                "filename": os.path.basename(f),
                "url": f"/static/catalog/{os.path.basename(f)}"
            }
            for idx, f in enumerate(image_files)
        ]
        
        return {
            "images": images,
            "total": len(images)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching catalog images: {str(e)}")

@app.get("/api/ratings/stats")
async def get_rating_stats():
    try:
        total_ratings = ratings_collection.count_documents({})
        
        if total_ratings == 0:
            return {
                "total_ratings": 0,
                "average_stars": 0,
                "star_distribution": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
            }
        
        # Calculate average
        pipeline = [
            {"$group": {"_id": None, "avg_stars": {"$avg": "$stars"}}}
        ]
        avg_result = list(ratings_collection.aggregate(pipeline))
        avg_stars = avg_result[0]["avg_stars"] if avg_result else 0
        
        # Star distribution
        star_distribution = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
        for i in range(1, 6):
            count = ratings_collection.count_documents({"stars": i})
            star_distribution[str(i)] = count
        
        return {
            "total_ratings": total_ratings,
            "average_stars": round(avg_stars, 2),
            "star_distribution": star_distribution
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)