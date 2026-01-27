import requests
import os
import sys

# Ensure video exists
if not os.path.exists('test_video.mp4'):
    print("Error: test_video.mp4 not found. Run generate_dummy_video.py first.")
    sys.exit(1)

url = 'http://localhost:3001/api/analyze'
files = {'video': open('test_video.mp4', 'rb')}

try:
    print("Sending video for analysis...")
    response = requests.post(url, files=files)
    
    if response.status_code == 200:
        data = response.json()
        print("\nAnalysis Result:")
        print(f"Verdict: {data.get('is_fake')}")
        print(f"Forensic Score: {data.get('forensicScore')}")
        print(f"Frames Analyzed: {data.get('framesAnalyzed')}")
        print(f"Duration: {data.get('duration')}")
        print(f"Frame Analysis: {len(data.get('frameAnalysis', []))} items")
        
        # Validation
        if 'forensicScore' in data and data['framesAnalyzed'] > 0:
            print("\nSUCCESS: Forensic data present.")
        else:
            print("\nFAILURE: Missing forensic data.")
    else:
        print(f"Error: {response.status_code} - {response.text}")

except Exception as e:
    print(f"Request failed: {e}")
