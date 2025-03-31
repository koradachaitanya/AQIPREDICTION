import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any
import math

class AQIPredictor:
    def predict(self, parameters: Dict[str, float]) -> float:
        # This is a simplified model for demonstration
        # In a real application, you would use a proper ML model
        weights = {
            'pm25': 0.4,
            'no2': 0.3,
            'o3': 0.2,
            'co': 0.1
        }
        
        normalized_values = {
            'pm25': parameters['pm25'] / 500,
            'no2': parameters['no2'] / 2000,
            'o3': parameters['o3'] / 500,
            'co': parameters['co'] / 50
        }
        
        aqi = sum(normalized_values[param] * weights[param] for param in weights) * 500
        return min(500, max(0, math.floor(aqi)))

class RequestHandler(BaseHTTPRequestHandler):
    predictor = AQIPredictor()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        parameters = json.loads(post_data.decode('utf-8'))
        
        prediction = self.predictor.predict(parameters)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = json.dumps({'prediction': prediction})
        self.wfile.write(response.encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()