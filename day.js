class day {

    constructor(did, dd, mm, yyyy, title, pas) {
        this.did = did;
        this.dd = dd;
        this.mm = mm;
        this.yyyy = yyyy;
        this.title = title;
        this.pas = pas;
    }

    dd_mm_yyyy() {
        return `${this.dd}.${this.mm}.${this.yyyy}`;
    }

    dd_mm() {
        return `${this.dd}.${this.mm}`;
    }
}

export default day;