from pypdf import PdfReader
import os

pdf_path = r"d:\AARYAN\HACKATHONS\ACCESSIBILITY AI\PROJECT RESEARCH\TESTING\TEST REPORT 1.pdf"
output_path = r"d:\AARYAN\HACKATHONS\ACCESSIBILITY AI\CODES\ai-help-for-needful-people\testsprite_tests\extracted_report.txt"

def extract_text():
    try:
        reader = PdfReader(pdf_path)
        number_of_pages = len(reader.pages)
        print(f"Reading {number_of_pages} pages...")
        
        full_text = ""
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            full_text += f"\n--- PAGE {i+1} ---\n{text}"
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_text)
            
        print(f"Successfully extracted text to {output_path}")
        
        # Print first 2000 chars for immediate preview
        print("\nPREVIEW:\n" + full_text[:2000])
        
    except Exception as e:
        print(f"Error extracting PDF: {e}")

if __name__ == "__main__":
    extract_text()
