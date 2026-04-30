import { ReportReason } from '../../../application/schemas'

export interface CreateReportDto {
  reason: ReportReason
  description?: string
}
