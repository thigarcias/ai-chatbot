/* eslint-disable no-control-regex */

export interface ConversionResult {
    text: string
    originalEncoding?: string | null
    modifications: Record<string, number>
    warnings: string[]
    success: boolean
}

export class StringSanitizer {
    sanitize(text: string): ConversionResult {
        const modifications: Record<string, number> = {}
        const warnings: string[] = []
        let result = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, () => {
            modifications['control_char_removed'] = (modifications['control_char_removed'] || 0) + 1
            return ''
        })
        result = result.trim()
        return {
            text: result,
            originalEncoding: "utf-8",
            modifications,
            warnings,
            success: true
        }
    }
}
