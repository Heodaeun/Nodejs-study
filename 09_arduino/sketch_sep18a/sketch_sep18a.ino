//
//
//void setup() {
//  Serial.begin(9600); //Connect to serial port with rate of 9600bps.
//  delay(1000);
//}
//
//void loop() {
//  int value = analogRead(A3); //Read the value from temperature sensor
//  int tempC = value*0.48828125; //Convert it into temp in C.
//  Serial.println(tempC); //Print it on Serial Monitor.
//  delay(60000); //Delay, specifies gap between two readings in miliseconds.
//}

float temperature;  
int reading;  
int lm35Pin = A0;

void setup()  
{
    analogReference(INTERNAL);
    Serial.begin(9600);
}

void loop()  
{
    reading = analogRead(lm35Pin);
    temperature = reading / 9.31;
    
    Serial.println(temperature);
    delay(1000);
}
