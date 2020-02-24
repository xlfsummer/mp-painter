import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { BuiltInPainterElementOption, createElement } from "./index";
import { BuiltInPainterPathOption, createPath } from "../painter-path/index";
import { PainterPath } from "../painter-path/base";

export interface PainterClipElementOption extends PainterElementOption {
    type: "clip"
    /** 裁剪使用的路径 */
    path: BuiltInPainterPathOption,
    /** 被裁剪的内容 */
    content: BuiltInPainterElementOption
}

export class PainterClipElement extends PainterElement {

    contentElement: PainterElement
    clipPath:       PainterPath

    constructor(painter: Painter, option: PainterClipElementOption, parent?: PainterElement){
        super(painter, option, parent);
        this.contentElement = createElement(painter, option.content, this);
        this.clipPath = createPath(this, option.path);
    }

    _layout(){
        return this.contentElement.layout();
    }

    async paint(){
        this.painter.ctx.save();
        await this.clipPath.paint();
        this.painter.ctx.clip();
        await this.contentElement.paint();
        this.painter.ctx.restore();
    }
}
