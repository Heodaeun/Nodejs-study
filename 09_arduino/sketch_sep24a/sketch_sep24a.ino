#define SIGNAL_PIN 2

void setup() {
  Serial.begin(9600);
  pinMode(SIGNAL_PIN, INPUT);
}

void loop() {
  if(digitalRead(SIGNAL_PIN)==HIGH) { //핀 2의 상태를 읽었을 때 HIGH 신호라면
    Serial.println("Movement detected."); 
  }else{  //pin 2 == LOW 신호라면
    Serial.println("Did not detect movement.");
  }
  delay(1000);  //1초마다 실행
}
