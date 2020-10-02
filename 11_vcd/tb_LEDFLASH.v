`timescale 1 ns / 1 ns

module tb_LEDFLASH;

reg             SCLK;
reg             PMOD1_P1;
reg             RESET_SYSB;
wire    [3:0]   LED;

LEDFLASH LD(
        .i_SCLK  	  (SCLK),
        .i_PMOD1_P1   (PMOD1_P1),
		.i_RESET_SYSB (RESET_SYSB),
        .o_LED        (LED)
        );

initial
begin
    SCLK 		= 1'b0;
	RESET_SYSB  = 1'b0;
    PMOD1_P1 	= 1'b1;
end

always
    #0.5 SCLK = ~SCLK;

initial
begin
    #2  RESET_SYSB  = 1'b1;
    #10 PMOD1_P1	= 1'b0;
    #13 PMOD1_P1	= 1'b1;
    #40 PMOD1_P1	= 1'b0;
    #43 PMOD1_P1	= 1'b1;
    #70 PMOD1_P1	= 1'b0;
    #73 PMOD1_P1	= 1'b1;
	#10 $finish;
end

initial
begin
    $dumpfile("out.vcd");
    $dumpvars(0, LD);
end

endmodule
