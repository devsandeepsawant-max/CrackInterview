const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_PAGES = 40;
const MAX_TEXT_LENGTH = 30_000;

export async function extractResumeText(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Choose a resume smaller than 5 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["pdf", "docx", "txt", "md", "text"].includes(extension)) {
    throw new Error("Choose a PDF, DOCX, or plain-text resume.");
  }

  let text = "";
  if (extension === "txt" || extension === "md" || extension === "text") {
    text = await file.text();
  } else if (extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.default.extractRawText({
      arrayBuffer: await file.arrayBuffer(),
    });
    text = result.value;
  } else {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const document = await pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
    }).promise;
    if (document.numPages > MAX_PDF_PAGES) {
      await document.cleanup();
      throw new Error("This demo can import PDFs with up to 40 pages.");
    }
    const pages: string[] = [];
    try {
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(
          content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" "),
        );
      }
    } finally {
      await document.cleanup();
    }
    text = pages.join("\n");
  }

  const cleaned = text.replace(/\u0000/g, "").trim().slice(0, MAX_TEXT_LENGTH);
  if (cleaned.length < 20) {
    throw new Error(
      "We couldn't extract enough text. If this is a scanned PDF, paste its text into the editor instead.",
    );
  }
  return cleaned;
}
