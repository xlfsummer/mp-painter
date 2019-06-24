class LineSpliterContext {

    fontSize: number;
    lineClamp: number;
    width: number;
    ctx: CanvasContext
    content: string;
    lines: string[];
    currentLineText: string;
    position: number;
    endPostion: number;
    isOverflow: boolean;
    isDry: boolean;

    constructor(option){
      this.fontSize = option.fontSize;
      this.lineClamp = option.lineClamp || Infinity;
      this.width = option.width;
      this.ctx = option.ctx;
      this.content = option.content;
  
      this.lines = [];
      this.currentLineText = "";
      this.position = 0;
      this.endPostion = this.position;
      this.isOverflow = false;
      this.isDry = false;
    }
  
    split(){
      // 测量文本前先设置字体大小
      this.ctx.setFontSize(this.fontSize);
      this.fillText();
      return this.lines;
    }
  
    minCharNumberInWidth(width){
      return Math.ceil(width / this.fontSize);
    }
  
    freeSpaceInCurrentLine(){
      if(!this.currentLineText.length)
        return this.width;
      else
        return this.width - this.ctx.measureText(this.currentLineText).width;
    }
  
    adjustCharNumberInCurrentLine(charNumber){
      let before = this.currentLineText.length;
      let after = before + charNumber;
      let restLength = this.content.length;
  
      after = Math.min(after, restLength);
      this.isDry = after == restLength;
      this.currentLineText = this.content.slice(0, after);
    }
  
    commitLine(){
      this.content = this.content.slice(this.currentLineText.length);
      this.lines.push(this.currentLineText);
      this.currentLineText = "";
      if(this.lines.length == this.lineClamp){
        this.isFull = true;
        if(this.isDry == false)
          this.isOverflow = true;
      }
    }
  
    handleOverflow(){
      let lastLine = this.lines.pop();
      lastLine = lastLine.substring(0, Math.max(0, lastLine.length - 2)) + "...";
      this.lines.push(lastLine);
    }
  
    fillText(){
      let freeSpaceInCurrentLine = this.freeSpaceInCurrentLine();
      if(freeSpaceInCurrentLine <= 0){
        this.adjustCharNumberInCurrentLine(-1);
        this.commitLine();
        if(this.isOverflow) this.handleOverflow();
        if(this.isFull) return;
        freeSpaceInCurrentLine = this.freeSpaceInCurrentLine();
      } else if(this.isDry){
        this.commitLine();
        return
      }
      let charNumber = this.minCharNumberInWidth(freeSpaceInCurrentLine);
      this.adjustCharNumberInCurrentLine(charNumber);
      this.fillText();
    }
  }
  