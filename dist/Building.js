export class Building {
    constructor(x, y, width, height, color) {
        this.angle = 0;
        this.angularVelocity = 0;
        this.isCollapsed = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.initialHeight = height;
        this.color = color;
    }
    update(shakeX, shakeIntensity) {
        if (this.isCollapsed)
            return;
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
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y);
        if (this.isCollapsed) {
            ctx.rotate(this.angle > 0 ? Math.PI / 2.5 : -Math.PI / 2.5);
            ctx.fillStyle = "#555";
            ctx.fillRect(-this.width / 2, -this.height, this.width, this.height);
        }
        else {
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
                        ctx.fillRect(-this.width / 2 + 5 + c * 15, -this.height + 10 + r * 20, 8, 12);
                    }
                }
            }
        }
        ctx.restore();
    }
    reset() {
        this.angle = 0;
        this.angularVelocity = 0;
        this.isCollapsed = false;
    }
}
