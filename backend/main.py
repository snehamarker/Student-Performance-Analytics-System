
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Read student data from CSV file
DATA_FILE = Path(__file__).with_name("students.csv")
students = pd.read_csv(DATA_FILE)

@app.route("/")
def home():
    return jsonify({
        "message": "Student Performance Analytics API is running!"
    })

@app.route("/api/students")
def get_students():
    return jsonify(students.to_dict(orient="records"))

@app.route("/api/analytics")
def get_analytics():
    return jsonify({
        "total_students": int(len(students)),
        "average_marks": round(float(students["marks"].mean()), 2),
        "average_attendance": round(float(students["attendance"].mean()), 2),
        "at_risk_students": int(
            ((students["marks"] < 40) |
             (students["attendance"] < 75)).sum()
        )
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
