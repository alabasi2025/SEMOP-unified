#!/bin/bash

# Function to create module files
create_module() {
  MODULE=$1
  ENTITY=$2
  
  # Controller
  cat > ${MODULE}/${MODULE}.controller.ts << CTRL
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ${ENTITY}Service } from './${MODULE}.service';

@Controller('${MODULE}')
export class ${ENTITY}Controller {
  constructor(private readonly ${MODULE}Service: ${ENTITY}Service) {}

  @Get()
  findAll() {
    return this.${MODULE}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.${MODULE}Service.findOne(id);
  }

  @Post()
  create(@Body() createDto: any) {
    return this.${MODULE}Service.create(createDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.${MODULE}Service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.${MODULE}Service.remove(id);
  }
}
CTRL

  # Service
  cat > ${MODULE}/${MODULE}.service.ts << SERV
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ${ENTITY}Service {
  private items = [];
  private nextId = 1;

  findAll() {
    return this.items;
  }

  findOne(id: number) {
    const item = this.items.find(i => i.id === id);
    if (!item) {
      throw new NotFoundException(\`Item with ID \${id} not found\`);
    }
    return item;
  }

  create(createDto: any) {
    const newItem = { id: this.nextId++, ...createDto };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, updateDto: any) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new NotFoundException(\`Item with ID \${id} not found\`);
    }
    this.items[index] = { ...this.items[index], ...updateDto };
    return this.items[index];
  }

  remove(id: number) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new NotFoundException(\`Item with ID \${id} not found\`);
    }
    this.items.splice(index, 1);
    return { message: 'Item deleted successfully' };
  }
}
SERV

  # Module
  cat > ${MODULE}/${MODULE}.module.ts << MOD
import { Module } from '@nestjs/common';
import { ${ENTITY}Controller } from './${MODULE}.controller';
import { ${ENTITY}Service } from './${MODULE}.service';

@Module({
  controllers: [${ENTITY}Controller],
  providers: [${ENTITY}Service],
  exports: [${ENTITY}Service]
})
export class ${ENTITY}Module {}
MOD
}

# Create all modules
create_module "permissions" "Permissions"
create_module "holdings" "Holdings"
create_module "units" "Units"
create_module "projects" "Projects"
create_module "customers" "Customers"
create_module "suppliers" "Suppliers"
create_module "items" "Items"

echo "All modules created successfully"
