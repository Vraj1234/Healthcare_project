from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS
from functools import wraps
import hashlib


app = Flask(__name__)
app.json.sort_keys = False
CORS(app)

def authenticate(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth = request.authorization
        if not auth or not authenticate_provider(auth.username, auth.password):
            return jsonify({'error': 'Authentication failed'}), 401
        return func(*args, **kwargs)
    return wrapper

def authenticate_provider(username, password):
    conn = sqlite3.connect('Healthcare.db')
    c = conn.cursor()
    c.execute("SELECT * FROM InsuranceProviders WHERE name=? AND password=?", (username, hashlib.sha256(password.encode()).hexdigest()))
    provider = c.fetchone()
    conn.close()
    return bool(provider)

@app.route('/api/v1/user/insurance/<string:provider_name>', methods=['GET'])
@authenticate
def get_insurance_provider(provider_name):
    conn = sqlite3.connect('Healthcare.db')
    c = conn.cursor()

    c.execute("SELECT * FROM Patient WHERE InsuranceProvider = ?", (provider_name,))
    patients = c.fetchall()

    if not patients:
        return jsonify({'error': 'No patients found for this insurance provider'}), 404

    patients_list = []
    for patient in patients:
        patients_list.append({
            'CustomerID': patient[0],
            'Name': patient[1],
            'Age': patient[2],
            'Gender': patient[3],
            'Doctor': patient[7],
            'BillingAmount': patient[9],
            'AdmissionType': patient[11],
            'Medication': patient[13],
            'TestResults': patient[14],
            'Status': patient[15]
        })

    return jsonify(patients_list)


@app.route('/api/v1/user/<int:user_id>/patient-info', methods=['GET'])
def get_customer_id(user_id):
    conn = sqlite3.connect('Healthcare.db')
    c = conn.cursor()

    # Get all users ordered by karma_score
    c.execute("SELECT * FROM Patient WHERE CustomerID=?", (user_id,))
    patient = c.fetchone()
    if patient is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'CustomerID': patient[0],
        'Name': patient[1],
        'Age': patient[2],
        'Gender': patient[3],
        'BloodType': patient[4],
        'MedicalCondition': patient[5],
        'DateOfAdmission': patient[6],
        'Doctor': patient[7],
        'InsuranceProvider': patient[8],
        'BillingAmount': patient[9],
        'RoomNumber': patient[10],
        'AdmissionType': patient[11],
        'DischargeDate': patient[12],
        'Medication': patient[13],
        'TestResults': patient[14],
        'Status': patient[15]
    })

    
if __name__ == '__main__':
    app.run(debug=True)