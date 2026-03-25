import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
    private resources: any[] = [];

    findAll(page: number = 1, limit: number = 10, search?: string) {
        let filtered = this.resources;
        if (search) {
            filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
        }

        const start = (page - 1) * limit;
        const end = start + limit;

        return {
            data: filtered.slice(start, end),
            meta: {
                total: filtered.length,
                page,
                limit,
                totalPages: Math.ceil(filtered.length / limit)
            }
        };
    }

    findOne(id: string) {
        const resource = this.resources.find(r => r.id === id);
        if (!resource) {
            throw new NotFoundException(`Resource with ID ${id} not found`);
        }
        return resource;
    }

    create(dto: CreateTestDto) {
        const newResource = {
            id: Math.random().toString(36).substr(2, 9),
            ...dto,
            createdAt: new Date().toISOString(),
        };
        this.resources.push(newResource);
        return newResource;
    }

    update(id: string, dto: UpdateTestDto) {
        const index = this.resources.findIndex(r => r.id === id);
        if (index === -1) {
            throw new NotFoundException(`Resource with ID ${id} not found`);
        }
        this.resources[index] = { ...this.resources[index], ...dto, updatedAt: new Date().toISOString() };
        return this.resources[index];
    }

    remove(id: string) {
        const index = this.resources.findIndex(r => r.id === id);
        if (index === -1) {
            throw new NotFoundException(`Resource with ID ${id} not found`);
        }
        const removed = this.resources.splice(index, 1);
        return removed[0];
    }
}
