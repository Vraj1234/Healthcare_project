import requests

provider_name = input("Enter Provider Name: ")
provider_password = input("Enter Provider Password: ")

url = "http://127.0.0.1:5000/api/v1/user/insurance/"+provider_name  # Replace with your actual API endpoint
auth = requests.auth.HTTPBasicAuth(provider_name, provider_password)
response = requests.get(url, auth=auth)

if response.status_code == 200:
    patients_data = response.json()
    print(patients_data)
else:
    print(f"Error: {response.status_code} - {response.text}")