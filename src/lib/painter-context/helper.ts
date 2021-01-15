export function createClass<T extends object>() {

    type instance = T & { context: T };

    let isProtoSet = false;

    const createProto = (ctx: T) => {

        let descs = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(ctx));

        let newDescs: PropertyDescriptorMap = {};

        for(let key in descs){

            const desc = descs[key];
            const newDesc: PropertyDescriptor = {};

            newDesc.enumerable = desc.enumerable;
            newDesc.configurable = desc.configurable;

            if(desc.value && typeof desc.value === "function"){
                newDesc.value = function (this: instance, ...arg: any[]){
                    return desc.value.call(this.context, ...arg)
                };
            }

            if(desc.value && typeof desc.value !== "function"){
                // @ts-ignore
                newDesc.get = function (this: instance) { return this.context[key] };
                // @ts-ignore
                newDesc.set = function (this: instance, v) { this.context[key] = v };
            }

            if(desc.get) {
                newDesc.get = function (this: instance) { return desc.get?.call(this.context) };
            }

            if(desc.set){
                newDesc.set = function (this: instance, v) { desc.set?.call(this.context, v) };
            }

            newDescs[key as string] = newDesc;
        }

        return Object.defineProperties({}, newDescs) as object;
    };

    const constructor = function (this: instance, prototype: T) {
        if(!(this instanceof constructor)){
            throw new Error("this is not instance of constructor");
        }

        this.context = prototype;
    
        if(isProtoSet) return;

        for(
            let cur = this, p = Object.getPrototypeOf(cur);
            p !== null;
            cur = p, p = Object.getPrototypeOf(cur)
        ){
            if(cur.constructor === constructor){
                Object.setPrototypeOf(cur, createProto(this.context));
                isProtoSet = true;
                break;
            }
        }
    };

    return constructor as unknown as new (prototype: T) => instance;
}

