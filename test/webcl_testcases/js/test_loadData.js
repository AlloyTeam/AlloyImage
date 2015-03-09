function test_loadData() {
    describe("test loadData function", function() {
   
        beforeEach(function() {
            this.layer = AlloyImage(70, 70, 'red');
        });
        
        it ("should invoke 'loadData' after transform-related operation", function() {
               spyOn(this.layer.webcl, 'loadData').and.callThrough();
               var ps = this.layer.scaleTo(90,90);
               expect(this.layer.webcl.loadData).toHaveBeenCalled();
        });
        
        it ("should invoke 'loadData' after clone operation", function() {
               spyOn(this.layer.webcl, 'loadData').and.callThrough();
               var ps = this.layer.clone();
               expect(this.layer.webcl.loadData).toHaveBeenCalled();
        });
        
        it ("should invoke 'loadData' after clip operation", function() {
               spyOn(this.layer.webcl, 'loadData').and.callThrough();
               var ps = this.layer.clip(0, 0, 35, 35);
               expect(this.layer.webcl.loadData).toHaveBeenCalled();
        });

        it ("should invoke 'loadData' after ctx-related operation", function() {
                spyOn(this.layer.webcl, 'loadData').and.callThrough();
                this.layer.ctx(function(){
                    this.fillStyle = "red";
                    this.font = "100px Arial";
                    this.fillText("AlloyImage", 0, 100);
                    this.drawImage(this.canvas, 0, 0);
                });
                expect(this.layer.webcl.loadData).toHaveBeenCalled();
        });

        it ("should update imgData in webcl after any loadData-related operation", function() {
                var test = this.layer.scaleTo(90,90).webcl.getResult();
                expect(test.length).toEqual(90 * 90 * 4);
                test = this.layer.clip(0, 0, 35, 35).webcl.getResult();
                expect(test.length).toEqual(35* 35 * 4);
        });

    });
}
