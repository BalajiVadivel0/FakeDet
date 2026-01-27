import pytest
import io
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the /health endpoint."""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'model_loaded' in data

def test_analyze_frame_no_image(client):
    """Test /inference/analyze-frame without an image."""
    response = client.post('/inference/analyze-frame', data={})
    assert response.status_code == 400
    assert 'error' in response.get_json()

def test_analyze_frame_with_image(client):
    """Test /inference/analyze-frame with a dummy image."""
    # Create a dummy image (100x100 red image)
    from PIL import Image
    
    img = Image.new('RGB', (100, 100), color='red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    data = {
        'image': (img_byte_arr, 'test.jpg'),
        'frameNumber': '1'
    }
    
    response = client.post('/inference/analyze-frame', data=data, content_type='multipart/form-data')
    
    assert response.status_code == 200
    json_data = response.get_json()
    
    assert json_data['frameNumber'] == '1'
    assert 'confidence' in json_data
    assert 'is_fake' in json_data
    # Since we use random weights/logic, just check types/existence
    assert isinstance(json_data['confidence'], float)
