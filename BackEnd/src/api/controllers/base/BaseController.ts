import type { Request, Response } from "express";

export abstract class BaseController<TService extends {
  getAllAsync: () => Promise<any[]>;
  getAsync: (id: string) => Promise<any>;
  setAsync: (dto: any) => Promise<any>;
  deleteAsync: (ids: string[]) => Promise<void>;
}> {
  protected abstract service: TService;

  async getAll(req: Request, res: Response): Promise<void> {
    const data = await this.service.getAllAsync();
    res.status(200).json(data);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Missing id parameter" });
      return;
    }
    const data = await this.service.getAsync(id);
    res.status(200).json(data);
  }

  async setAsync(req: Request, res: Response): Promise<void> {
    const dto = req.body;
    const result = await this.service.setAsync(dto);
    res.status(200).json(result);
  }

  async deleteAsync(req: Request, res: Response): Promise<void> {
    const ids = req.body as string[];
    await this.service.deleteAsync(ids);
    res.status(200).json({ message: "Deleted successfully" });
  }
}