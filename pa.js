// pa short for paragraph

class pa {

    constructor(did, mid, dd, mm, yyyy, tag, title, text) {
        this.did = did;
        this.mid = mid;
        this.dd = dd;
        this.mm = mm;
        this.yyyy = yyyy;
        this.tag = tag;
        this.title = title;
        this.text = text;
    }

    dd_mm_yyyy() {
        return `${this.dd}.${this.mm}.${this.yyyy}`;
    }

    dd_mm() {
        return `${this.dd}.${this.mm}`;
    }
}


// const pa1 = new pa(1, 1, "01", "10", "2016", "test", "test paragraph");
// console.log(pa1.dd_mm_yyyy());
// console.log(JSON.stringify(pa1));

export default pa;