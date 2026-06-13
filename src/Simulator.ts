import { Building } from "./Building.ts";

export class Simulator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private buildings: Building[] = [];
    private isShaking: boolean = false;
    private shakeStartTime: number = 0;
    private magnitude: number = 7.0;
    
    private epicenterX: number = 400;
    private epicenterY: number = 450;
    private pWaveRadius: number = 0;
    private sWaveRadius: number = 0;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.initBuildings();
    }

    private initBuildings(): void {
        this.buildings = [
            new Building(100, 400, 60, 250, "#3c6382"),
            new Building(200, 400, 80, 320, "#0a3d62"),
            new Building(320, 400, 50, 180, "#38ada9"),
            new Building(420, 400, 90, 380, "#079992"),
            new Building(560, 400, 70, 220, "#e67e22"),
            new Building(670, 400, 60, 150, "#d35400"),
        ];
    }

    public triggerEarthquake(mag: number): void {
        this.magnitude = mag;
        this.isShaking = true;
        this.shakeStartTime = Date.now();
        this.pWaveRadius = 0;
        this.sWaveRadius = 0;
        this.buildings.forEach(b => b.reset());
    }

    public update(): void {
        let offsetX = 0;
        let offsetY = 0;

        if (this.isShaking) {
            const elapsed = (Date.now() - this.shakeStartTime) / 1000;

            this.pWaveRadius = elapsed * 400;
            this.sWaveRadius = elapsed * 200;

            if (elapsed < 8) {
                const maxAmplitude = Math.pow(2, this.magnitude - 3); 
                const intensityFactor = this.sWaveRadius > 100 ? 1.0 : 0.2;

                offsetX = Math.sin(elapsed * 50) * maxAmplitude * intensityFactor * (1 - elapsed/8);
                offsetY = Math.cos(elapsed * 40) * (maxAmplitude * 0.5) * intensityFactor * (1 - elapsed/8);
            } else {
                this.isShaking = false;
            }
        }

        this.buildings.forEach(b => {
            const distToEpicenter = Math.abs((b.x + b.width/2) - this.epicenterX);
            if (this.isShaking && this.sWaveRadius > distToEpicenter) {
                b.update(offsetX, Math.pow(2, this.magnitude - 4));
            } else {
                b.update(0, 0);
            }
        });

        this.draw(offsetX, offsetY);
    }

    private draw(offsetX: number, offsetY: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.translate(offsetX, offsetY);

        // 空
        this.ctx.fillStyle = "#2c3e50";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 地震波
        if (this.isShaking) {
            this.ctx.strokeStyle = "rgba(0, 168, 255, 0.4)";
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.epicenterX, this.epicenterY, this.pWaveRadius, 0, Math.PI, true);
            this.ctx.stroke();

            this.ctx.strokeStyle = "rgba(232, 65, 24, 0.6)";
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(this.epicenterX, this.epicenterY, this.sWaveRadius, 0, Math.PI, true);
            this.ctx.stroke();
        }

        // 地面
        this.ctx.fillStyle = "#34495e";
        this.ctx.fillRect(0, 400, this.canvas.width, 100);

        // ビル
        this.buildings.forEach(b => b.draw(this.ctx));

        // 震源
        this.ctx.fillStyle = "#e74c3c";
        this.ctx.beginPath();
        this.ctx.arc(this.epicenterX, this.epicenterY, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // UI表示
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "16px Arial";
        if (this.isShaking) {
            this.ctx.fillStyle = this.sWaveRadius > 150 ? "#ff4757" : "#ffa502";
            this.ctx.fillText(this.sWaveRadius > 150 ? "警告: 主要動 (S波) 到達中！" : "初期微動 (P波) 検知...", 20, 30);
        } else {
            this.ctx.fillText("ステータス: 待機中", 20, 30);
        }
    }

    public startLoop(): void {
        const loop = () => {
            this.update();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}