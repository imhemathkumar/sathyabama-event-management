export interface BulkCertificate {
  id: number
  name: string
  register_number: string
  description: string
  date: string
}

export function parseCSV(csvData: string): BulkCertificate[] {
  try {
    const rows = csvData.split("\n")
    if (rows.length <= 1) {
      throw new Error("CSV file is empty or has only headers")
    }

    const headers = rows[0].split(",").map((header) => header.trim().toLowerCase())

    // Find the indices of required columns
    const nameIndex = headers.findIndex((h) => h.includes("name"))
    const registerNumberIndex = headers.findIndex((h) => h === "register_number")
    const descriptionIndex = headers.findIndex((h) => h.includes("description"))

    if (nameIndex === -1) {
      throw new Error("CSV must contain a 'name' column")
    }

    if (registerNumberIndex === -1) {
      throw new Error("CSV must contain a 'register_number' column")
    }

    return rows
      .slice(1)
      .filter((row) => row.trim() !== "")
      .map((row, idx) => {
        const columns = row.split(",").map((col) => col.trim())

        return {
          id: idx + 1,
          name: columns[nameIndex] || `Recipient ${idx + 1}`,
          register_number: columns[registerNumberIndex] || "",
          description: descriptionIndex !== -1 ? columns[descriptionIndex] : "",
          date: new Date().toISOString().split("T")[0],
        }
      })
  } catch (error) {
    console.error("Error parsing CSV:", error)
    throw error
  }
}

export function generateSampleCSV(): string {
  const headers = ["name", "register_number", "description"]
  const rows = [
    ["John Doe", "SIST2022CS001", "Outstanding Achievement"],
    ["Jane Smith", "SIST2022CS002", "Excellence in Leadership"],
    ["Bob Johnson", "SIST2022CS003", "Exceptional Performance"],
  ]

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

export function downloadSampleCSV(): void {
  const csvContent =
    "name,register_number,description,date\nJohn Doe,2024001,Outstanding Achievement,2024-03-04\nJane Smith,2024002,Excellence in Leadership,2024-03-04"
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "certificate_template.csv")
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

