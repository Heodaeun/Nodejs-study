`timescale 1 ns / 1 ns

module LEDFLASH (
  input  		i_SCLK,
  input  		i_RESET_SYSB,
  input  		i_PMOD1_P1,
  output [3:0]  o_LED
  );
// =======================  
  reg  [3:0] LED_COUNT;
  reg         PULSE;
// =======================
  always @(posedge i_SCLK or negedge i_RESET_SYSB)
	if( ~i_RESET_SYSB )
		PULSE <= 0;
	else
        PULSE <= i_PMOD1_P1;

  always @(posedge i_SCLK or negedge i_RESET_SYSB)
	if( ~i_RESET_SYSB )
		LED_COUNT <= 0;
	else if( PULSE )
        LED_COUNT <= LED_COUNT + 1;

  assign o_LED[3:0] = LED_COUNT[3:0];	// connects led outputs to counter value

endmodule
