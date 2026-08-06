from fastapi import APIRouter, Depends
from app.models import User
from app.auth import get_current_user

router = APIRouter()

@router.get("/")
def get_innovation_score(
    current_user: User = Depends(get_current_user)
):
    """Dynamically compile innovation score metrics based on user's portfolio."""
    publications_count = len(current_user.publications)
    patents_count = len(current_user.patents)
    
    # Dynamic calculation
    novelty = min(98, 65 + publications_count * 4 + patents_count * 3)
    translation = min(95, 50 + patents_count * 12 + (1 if publications_count > 0 else 0) * 8)
    velocity = min(96, 60 + patents_count * 8 + (1 if publications_count > 0 else 0) * 5)
    collaboration = min(98, 70 + (4 if publications_count > 3 else 0))
    funding_efficiency = min(92, 75 + (patents_count * 2))
    
    overall_score = int((novelty * 0.3) + (translation * 0.25) + (velocity * 0.2) + (collaboration * 0.15) + (funding_efficiency * 0.1))
    if publications_count == 0 and patents_count == 0:
        overall_score = 0
        novelty = 0
        translation = 0
        velocity = 0
        collaboration = 0
        funding_efficiency = 0
        suggested_improvements = [
            "Register your first patent in the Patents module to initialize translation tracking.",
            "Upload your research papers in the Publications module to launch citation analysis."
        ]
    else:
        overall_score = int((novelty * 0.3) + (translation * 0.25) + (velocity * 0.2) + (collaboration * 0.15) + (funding_efficiency * 0.1))
        suggested_improvements = [
            "Submit patents in pending technology domains to increase translation velocity.",
            "Establish more cross-institutional collaborations to boost peer connectivity profile.",
            "Consolidate research outcomes into higher-impact editorial journals."
        ]

    return {
        "overall_score": overall_score,
        "metrics": {
            "novelty": novelty,
            "translation": translation,
            "velocity": velocity,
            "collaboration": collaboration,
            "funding_efficiency": funding_efficiency
        },
        "benchmarks": {
            "global_average": 68,
            "peer_percentile": 87 if overall_score > 0 else 0,
            "field_leader_score": 92
        },
        "suggested_improvements": suggested_improvements
    }
