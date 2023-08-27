export class Digit {
    Root: HTMLDivElement;
    Childs: HTMLDivElement[];
    Next?: Digit;
    Prev?: Digit;
    Done: boolean;

    constructor(element: HTMLDivElement){
        this.Root = element;
        this.Childs = Array.from(element.querySelectorAll<HTMLDivElement>(".dig"));
        this.Done = false;
    }

    RunCountUp = () => {
        if(this.Prev === undefined && this.Root.dataset.current === this.Root.dataset.count){
            this.Done = true;
        }

        const currentCount = this.getCurrentCount();
        if(currentCount !== undefined){
            const currentNode = this.getActive(currentCount);
            if(currentCount === 9){
                this.Next?.RunCountUp();
                this.reset()
            }
            else{
                currentNode.style.marginTop = `-${currentNode.offsetHeight}px`
                this.Root.dataset.current = (currentCount + 1).toString();
            }
           
        }
        
    }

    // IncrementDigitUp = () => {
    //     const countTo = Number.parseInt(this.Root.dataset.count!);
    //     for(const digit of this.Childs){
    //        setTimeout(() => {
    //         const value = Number.parseInt(digit.dataset.value!);
    //         if(value === countTo){
    //             break;
    //         }
    //         digit.style.marginTop = `-${digit.offsetHeight}px`
    //         this.Root.dataset.current = (value + 1).toString();
    //        }, 100)
    //     }
    // }

    getActive = (count: number) => {
       if(count < 9){
            return this.Childs[count];
       }
       else{
        return this.Childs[0];
       }
    }

    reset = () => {
        this.Childs.forEach((c) => {
            c.style.marginTop = "0px";
        })
        this.Root.dataset.current = "0";
    }

    getCurrentCount = () => {
        const count = this.Root.dataset.current;
        if(count) return Number.parseInt(count);
    }
}