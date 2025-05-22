import { Pipe, type PipeTransform } from "@angular/core"

@Pipe({
  name: "imagePreview",
  standalone: true,
})
export class ImagePreviewPipe implements PipeTransform {
  transform(file: File): string {
    if (!file) {
      return ""
    }

    return URL.createObjectURL(file)
  }
}
