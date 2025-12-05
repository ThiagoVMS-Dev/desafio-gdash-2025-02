import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { WeatherService } from '../weather/weather.service';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

@Controller('api/export')
export class ExportController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async export(@Query('from') from: string, @Query('to') to: string, @Query('format') format = 'csv', @Res() res: Response) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const data = await this.weatherService.findRange(fromDate, toDate);
    const rows = data.map(d => ({
      id: d._id,
      timestamp: d.timestamp,
      tempC: d.tempC,
      latitude: d.latitude,
      longitude: d.longitude,
      source: d.source
    }));
    if (format === 'xlsx') {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Weather');
      ws.columns = [
        { header: 'id', key: 'id', width: 30 },
        { header: 'timestamp', key: 'timestamp', width: 32 },
        { header: 'tempC', key: 'tempC', width: 12 },
        { header: 'latitude', key: 'latitude', width: 12 },
        { header: 'longitude', key: 'longitude', width: 12 },
        { header: 'source', key: 'source', width: 20 },
      ];
      rows.forEach(r => ws.addRow(r));
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
      await wb.xlsx.write(res);
      res.end();
      return;
    } else {
      const parser = new Parser();
      const csv = parser.parse(rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
      res.send(csv);
    }
  }
}
