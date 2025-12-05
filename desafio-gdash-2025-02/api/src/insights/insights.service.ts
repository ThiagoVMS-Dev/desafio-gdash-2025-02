import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class InsightsService {
  constructor(private readonly weatherService: import('../weather/weather.service').WeatherService) {}

  async generateForRange(fromStr: string, toStr: string) {
    const from = new Date(fromStr);
    const to = new Date(toStr);
    const data = await this.weatherService.findRange(from, to);
    const temps = data.map(d => d.tempC).filter(t => typeof t === 'number');
    if (!temps.length) return { text: 'Not enough data for insights' };
    const avg = temps.reduce((a,b)=>a+b,0)/temps.length;
    const max = Math.max(...temps);
    const min = Math.min(...temps);
    const simple = `Between ${from.toISOString()} and ${to.toISOString()} average temp was ${avg.toFixed(2)}°C (min ${min}°C, max ${max}°C).`;
    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `Gere insights curtos e práticos a partir dos valores: avg ${avg.toFixed(2)}, min ${min}, max ${max}.`;
        const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 250
        }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }});
        const text = resp.data?.choices?.[0]?.message?.content;
        return { text: text || simple };
      } catch (err) {
        return { text: simple, error: 'openai_failed' };
      }
    }
    return { text: simple };
  }
}
