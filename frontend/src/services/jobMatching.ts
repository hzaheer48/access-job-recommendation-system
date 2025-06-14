import { Job, UserProfile, Skill } from '../types';

interface JobMatch {
  job: Job;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  skillGaps: {
    skill: string;
    requiredLevel: number;
    userLevel: number;
  }[];
  recommendations: {
    skill: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

interface JobSimilarity {
  job1: Job;
  job2: Job;
  similarityScore: number;
  commonSkills: string[];
  commonRequirements: string[];
}

export const calculateJobMatch = (job: Job, userProfile: UserProfile): JobMatch => {
  const userSkills = new Set(userProfile.skills.map(s => s.toLowerCase()));
  const jobSkills = new Set(job.requiredSkills.map(s => s.toLowerCase()));
  
  // Calculate matching skills
  const matchingSkills = Array.from(jobSkills).filter(skill => userSkills.has(skill));
  const missingSkills = Array.from(jobSkills).filter(skill => !userSkills.has(skill));
  
  // Calculate skill gaps
  const skillGaps = job.requiredSkills.map(skill => {
    const userSkill = userProfile.skills.find(s => s.toLowerCase() === skill.toLowerCase());
    const requiredLevel = job.skillLevels?.[skill] || 3; // Default to intermediate level
    const userLevel = userSkill?.proficiencyLevel || 0;
    
    return {
      skill,
      requiredLevel,
      userLevel
    };
  }).filter(gap => gap.userLevel < gap.requiredLevel);
  
  // Calculate match score (0-100)
  const baseScore = (matchingSkills.length / job.requiredSkills.length) * 100;
  const skillGapPenalty = skillGaps.reduce((penalty, gap) => {
    return penalty + ((gap.requiredLevel - gap.userLevel) * 10);
  }, 0);
  
  const matchScore = Math.max(0, Math.min(100, baseScore - skillGapPenalty));
  
  // Generate recommendations
  const recommendations = missingSkills.map(skill => ({
    skill,
    reason: `Required for this position`,
    priority: 'high' as const
  })).concat(
    skillGaps.map(gap => ({
      skill: gap.skill,
      reason: `Current level (${gap.userLevel}) is below required level (${gap.requiredLevel})`,
      priority: gap.requiredLevel - gap.userLevel > 1 ? 'high' : 'medium' as const
    }))
  );
  
  return {
    job,
    matchScore,
    matchingSkills,
    missingSkills,
    skillGaps,
    recommendations
  };
};

export const calculateJobSimilarity = (job1: Job, job2: Job): JobSimilarity => {
  const job1Skills = new Set(job1.requiredSkills.map(s => s.toLowerCase()));
  const job2Skills = new Set(job2.requiredSkills.map(s => s.toLowerCase()));
  
  // Calculate common skills
  const commonSkills = Array.from(job1Skills).filter(skill => job2Skills.has(skill));
  
  // Calculate common requirements
  const commonRequirements = job1.requirements.filter(req => 
    job2.requirements.some(r => r.toLowerCase().includes(req.toLowerCase()))
  );
  
  // Calculate similarity score (0-100)
  const skillSimilarity = (commonSkills.length / Math.max(job1Skills.size, job2Skills.size)) * 50;
  const requirementSimilarity = (commonRequirements.length / Math.max(job1.requirements.length, job2.requirements.length)) * 50;
  
  const similarityScore = skillSimilarity + requirementSimilarity;
  
  return {
    job1,
    job2,
    similarityScore,
    commonSkills,
    commonRequirements
  };
};

export const getRecommendedJobs = (userProfile: UserProfile, jobs: Job[]): JobMatch[] => {
  // Calculate match scores for all jobs
  const jobMatches = jobs.map(job => calculateJobMatch(job, userProfile));
  
  // Sort by match score
  return jobMatches.sort((a, b) => b.matchScore - a.matchScore);
};

export const getSimilarJobs = (job: Job, jobs: Job[]): JobSimilarity[] => {
  // Calculate similarity scores with all other jobs
  const similarities = jobs
    .filter(j => j.id !== job.id)
    .map(j => calculateJobSimilarity(job, j));
  
  // Sort by similarity score
  return similarities.sort((a, b) => b.similarityScore - a.similarityScore);
};

export const getSkillRecommendations = (userProfile: UserProfile, jobs: Job[]): {
  skill: string;
  demand: number;
  averageLevel: number;
  jobs: Job[];
}[] => {
  // Count skill occurrences and levels across all jobs
  const skillStats = new Map<string, {
    count: number;
    totalLevel: number;
    jobs: Job[];
  }>();
  
  jobs.forEach(job => {
    job.requiredSkills.forEach(skill => {
      const stats = skillStats.get(skill) || { count: 0, totalLevel: 0, jobs: [] };
      stats.count++;
      stats.totalLevel += job.skillLevels?.[skill] || 3;
      stats.jobs.push(job);
      skillStats.set(skill, stats);
    });
  });
  
  // Convert to array and calculate recommendations
  return Array.from(skillStats.entries())
    .map(([skill, stats]) => ({
      skill,
      demand: stats.count,
      averageLevel: stats.totalLevel / stats.count,
      jobs: stats.jobs
    }))
    .filter(rec => !userProfile.skills.some(s => s.toLowerCase() === rec.skill.toLowerCase()))
    .sort((a, b) => b.demand - a.demand);
}; 