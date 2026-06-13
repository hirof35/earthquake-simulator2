export class Building {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public color: string;
    
    private angle: number = 0;
    private angularVelocity: number = 0;
    public isCollapsed: boolean = false;
    private initialHeight: number;

    constructor(x: number, y: number, width: number, height: number, color: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.initialHeight = height;
        this.color = color;
    }

    public update(shakeX: number, shakeIntensity: number): void {
        if (this.isCollapsed) return;

        // 耐震基準（高さ依存）を超えたら傾く
        const tolerance = (this.initialHeight > 200) ? 15 : 25; 
        if (Math.abs(shakeX) > tolerance) {
            this.angularVelocity += (shakeX > 0 ? 0.002 : -0.002) * (shakeIntensity / 10);
        }

        // 復元力と摩擦
        this.angularVelocity -= this.angle * 0.05;
        this.angularVelocity *= 0.95;
        this.angle += this.angularVelocity;

        // 一定以上傾いたら倒壊
        if (Math.abs(this.angle) > 0.5) {
            this.isCollapsed = true;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y);
        
        if (this.isCollapsed) {
            ctx.rotate(this.angle > 0 ? Math.PI / 2.5 : -Math.PI / 2.5);
            ctx.fillStyle = "#555";
            ctx.fillRect(-this.width / 2, -this.height, this.width, this.height);
        } else {
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height, this.width, this.height);

            // 窓の描写
            ctx.fillStyle = "rgba(255, 255, 100, 0.7)";
            const rows = Math.floor(this.height / 20);
            const cols = Math.floor(this.width / 15);
            for (let r = 0; r < rows - 1; r++) {
                for (let c = 0; c < cols; c++) {
                    if ((r + c) % 3 !== 0) {
                        ctx.fillRect(-this.width/2 + 5 + c*15, -this.height + 10 + r*20, 8, 12);
                    }
                }
            }
        }
        ctx.restore();
    }

    public reset(): void {
        this.angle = 0;
        this.angularVelocity = 0;
        this.isCollapsed = false;
    }
}