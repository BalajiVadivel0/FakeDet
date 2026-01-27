import cv2
import numpy as np

# Create a red video
width, height = 640, 480
fps = 30
duration = 1  # seconds
output_file = 'test_video.mp4'

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_file, fourcc, fps, (width, height))

for _ in range(fps * duration):
    # Create a red frame
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    frame[:] = (0, 0, 255)  # BGR format for OpenCV
    out.write(frame)

out.release()
print(f"Index: Created {output_file}")
