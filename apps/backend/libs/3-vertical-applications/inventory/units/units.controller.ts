import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnitsService } from './units.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new unit' })
  create(@Body() createDto: any) {
    return this.unitsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  findAll() {
    return this.unitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unit by ID' })
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update unit' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.unitsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete unit' })
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
