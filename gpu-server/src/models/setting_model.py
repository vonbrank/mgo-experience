from app import db


class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return f"{self.key} = {self.value}"
