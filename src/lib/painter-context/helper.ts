import Painter from "../painter";

type CompatableContext = CanvasContext | CanvasRenderingContext2D;

function createExtensableContextProto(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D{

    let descs = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(ctx)) as
        Record<keyof CanvasRenderingContext2D, PropertyDescriptor>;

    let newDescs: PropertyDescriptorMap = {};

    for(let _key in descs){

        // work around ts
        let key = _key as keyof CanvasRenderingContext2D;

        const desc = descs[key];
        const newDesc: PropertyDescriptor = {};

        newDesc.enumerable = desc.enumerable;
        newDesc.configurable = desc.configurable;

        if(desc.value && typeof desc.value === "function"){
            newDesc.value = desc.value.bind(ctx);
        }

        if(desc.value && typeof desc.value !== "function"){
            newDesc.get = () => ctx[key];
            // @ts-ignore
            newDesc.set = v => ctx[key] = v;
        }

        if(desc.get) {
            newDesc.get = desc.get.bind(ctx);
        }

        if(desc.set){
            newDesc.set = desc.set.bind(ctx);
        }

        newDescs[key] = newDesc;
    }

    return Object.defineProperties({}, newDescs);
}

function creatClassFromPrototype<T extends object>(prototype: T) {
    return Object.assign(function () {}, { prototype }) as unknown as new (p: T) => T;
}