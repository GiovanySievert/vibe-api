export type JobStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface Job {
  id: string
  type: string
  status: JobStatus
  progress: {
    total: number
    processed: number
    batches: number
  }
  error?: string
  startedAt: Date
  completedAt?: Date
}

class JobManager {
  private jobs: Map<string, Job> = new Map()

  createJob(type: string): Job {
    const id = crypto.randomUUID()
    const job: Job = {
      id,
      type,
      status: 'pending',
      progress: {
        total: 0,
        processed: 0,
        batches: 0
      },
      startedAt: new Date()
    }

    this.jobs.set(id, job)
    return job
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id)
  }

  updateJob(id: string, updates: Partial<Job>): void {
    const job = this.jobs.get(id)
    if (job) {
      Object.assign(job, updates)
    }
  }

  updateProgress(
    id: string,
    progress: Partial<Job['progress']>
  ): void {
    const job = this.jobs.get(id)
    if (job) {
      Object.assign(job.progress, progress)
    }
  }

  completeJob(id: string): void {
    const job = this.jobs.get(id)
    if (job) {
      job.status = 'completed'
      job.completedAt = new Date()
    }
  }

  failJob(id: string, error: string): void {
    const job = this.jobs.get(id)
    if (job) {
      job.status = 'failed'
      job.error = error
      job.completedAt = new Date()
    }
  }

  listJobs(type?: string): Job[] {
    const jobs = Array.from(this.jobs.values())
    if (type) {
      return jobs.filter((job) => job.type === type)
    }
    return jobs
  }

  cleanOldJobs(maxAgeMs: number = 1000 * 60 * 60): void {
    const now = Date.now()
    for (const [id, job] of this.jobs) {
      if (job.completedAt && now - job.completedAt.getTime() > maxAgeMs) {
        this.jobs.delete(id)
      }
    }
  }
}

export const jobManager = new JobManager()
