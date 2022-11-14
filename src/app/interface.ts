export interface Script {
    urlbase: string;
    withcredentials: boolean;
    commands: Command[];
}

export interface Command {
    type: string;
    id: string;
    description: string;
    url: string;
    method: string;
    payload: any;
    check_status: number;
    source: string;
    property: any;
    value: any;
    source1: string;
    property1: any;
    source2: string;
    property2: any;
}
