import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Page } from './entity/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import slugify from 'slugify';

@Injectable()
export class PagesService {
    constructor(
        @InjectRepository(Page)
        private pageRepository: Repository<Page>,
    ) { }

    async create(createPageDto: CreatePageDto) {
        let slug = createPageDto.slug;
        if (!slug) {
            slug = slugify(createPageDto.title, { lower: true, strict: true });
        } else {
            slug = slugify(slug, { lower: true, strict: true });
        }

        // Check uniqueness
        await this.ensureSlugUnique(slug);

        const page = this.pageRepository.create({
            ...createPageDto,
            slug
        });
        return this.pageRepository.save(page);
    }

    async findAllAdmin(search?: string, page: number = 1, limit: number = 10) {
        const query = this.pageRepository.createQueryBuilder('page');

        if (search) {
            query.where('page.title LIKE :search', { search: `%${search}%` });
        }

        query.orderBy('page.createdAt', 'DESC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        };
    }

    async findOne(id: string) {
        const page = await this.pageRepository.findOneBy({ id });
        if (!page) throw new NotFoundException('Page not found');
        return page;
    }

    async findBySlug(slug: string) {
        const page = await this.pageRepository.findOneBy({ slug });
        if (!page) throw new NotFoundException('Page not found');
        return page;
    }

    async update(id: string, updatePageDto: UpdatePageDto) {
        const page = await this.findOne(id);

        if (updatePageDto.slug) {
            const newSlug = slugify(updatePageDto.slug, { lower: true, strict: true });
            if (newSlug !== page.slug) {
                await this.ensureSlugUnique(newSlug, id);
                page.slug = newSlug;
            }
        } else if (updatePageDto.title && !page.slug) {
            // Optional: generate slug if it was somehow empty or if policy is to always regenerate (usually not)
            // Here we strictly follow DTO: if slug is not targeted, don't change it.
        }

        const updatedPage = this.pageRepository.merge(page, updatePageDto);
        return this.pageRepository.save(updatedPage);
    }

    async remove(id: string) {
        const result = await this.pageRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Page not found');
        return { deleted: true };
    }

    private async ensureSlugUnique(slug: string, excludeId?: string) {
        const where: any = { slug };
        if (excludeId) {
            where.id = Not(excludeId);
        }
        const exist = await this.pageRepository.findOneBy(where);
        if (exist) {
            throw new ConflictException(`Slug '${slug}' already exists`);
        }
    }
}
