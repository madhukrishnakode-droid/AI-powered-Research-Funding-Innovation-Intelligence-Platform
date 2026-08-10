from app.database import engine
from sqlalchemy import inspect
from app.models.user import User
from app.models.research_profile import ResearchProfile
from app.models.publication import Publication
from app.models.patent import Patent
print('Imported models:', User.__name__, ResearchProfile.__name__, Publication.__name__, Patent.__name__)
insp = inspect(engine)
try:
    tables = insp.get_table_names()
except Exception as e:
    print('Error listing tables:', e)
    raise

print('Tables in DB:', tables)
