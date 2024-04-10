import sqlite3
import hashlib

def add_insurance_provider():
    conn = sqlite3.connect('Healthcare.db')
    c = conn.cursor()

    provider_id = input("Enter Provider ID: ")
    provider_name = input("Enter Provider Name: ")
    provider_password = input("Enter Provider Password: ")

    # Hash the password using SHA-256
    hashed_password = hashlib.sha256(provider_password.encode()).hexdigest()

    try:
        c.execute("INSERT INTO InsuranceProviders (id, name, password) VALUES (?, ?, ?)", (provider_id, provider_name, hashed_password))
        conn.commit()
        print("Insurance provider added successfully.")
    except sqlite3.IntegrityError:
        print("Error: Provider ID or name already exists.")
    finally:
        conn.close()

if __name__ == "__main__":
    add_insurance_provider()