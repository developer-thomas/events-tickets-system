export interface EventUpload {
    data: EventData;
    file: any; // Ou você pode usar `any` se não for sempre um arquivo real
  }
  
  export interface EventData {
    title: string;
    eventLocationId: number;
    dateInit: string;     // Pode usar Date se for do tipo Date
    dateFinish: string;
    fileKey: string;
    fileUrl: string;
    videoLink: string;
  }