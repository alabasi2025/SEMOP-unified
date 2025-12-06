/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const auth_module_1 = __webpack_require__(7);
const users_module_1 = __webpack_require__(11);
const dashboard_module_1 = __webpack_require__(14);
const roles_module_1 = __webpack_require__(17);
const permissions_module_1 = __webpack_require__(20);
const holdings_module_1 = __webpack_require__(23);
const units_module_1 = __webpack_require__(26);
const projects_module_1 = __webpack_require__(29);
const customers_module_1 = __webpack_require__(32);
const suppliers_module_1 = __webpack_require__(35);
const items_module_1 = __webpack_require__(38);
const accounts_module_1 = __webpack_require__(41);
const journal_entries_module_1 = __webpack_require__(44);
const cost_centers_module_1 = __webpack_require__(47);
const fiscal_years_module_1 = __webpack_require__(50);
const fiscal_periods_module_1 = __webpack_require__(53);
const warehouses_module_1 = __webpack_require__(56);
const stock_movements_module_1 = __webpack_require__(59);
const genes_module_1 = __webpack_require__(62);
const documentation_module_1 = __webpack_require__(65);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            dashboard_module_1.DashboardModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            holdings_module_1.HoldingsModule,
            units_module_1.UnitsModule,
            projects_module_1.ProjectsModule,
            customers_module_1.CustomersModule,
            suppliers_module_1.SuppliersModule,
            items_module_1.ItemsModule,
            accounts_module_1.AccountsModule,
            journal_entries_module_1.JournalEntriesModule,
            cost_centers_module_1.CostCentersModule,
            fiscal_years_module_1.FiscalYearsModule,
            fiscal_periods_module_1.FiscalPeriodsModule,
            warehouses_module_1.WarehousesModule,
            stock_movements_module_1.StockMovementsModule,
            genes_module_1.GenesModule,
            documentation_module_1.DocumentationModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_controller_1 = __webpack_require__(8);
const auth_service_1 = __webpack_require__(9);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(9);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt = tslib_1.__importStar(__webpack_require__(10));
let AuthService = class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'SEMOP_SECRET_KEY';
        this.JWT_EXPIRES_IN = '24h';
        // Dummy users for testing - في الإنتاج يجب استخدام قاعدة البيانات
        this.users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123', // في الإنتاج يجب تشفير كلمة المرور
                email: 'admin@semop.com',
                firstName: 'مدير',
                lastName: 'النظام',
                isActive: true,
                roleId: 1
            }
        ];
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        // Find user
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new common_1.UnauthorizedException('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
        // Generate tokens
        const payload = { sub: user.id, username: user.username };
        const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
        const refreshToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return {
            accessToken,
            refreshToken,
            user: userWithoutPassword
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AuthService);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const users_controller_1 = __webpack_require__(12);
const users_service_1 = __webpack_require__(13);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService]
    })
], UsersModule);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const users_service_1 = __webpack_require__(13);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll() {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let UsersService = class UsersService {
    constructor() {
        // Dummy data - في الإنتاج يجب استخدام Prisma
        this.users = [
            { id: 1, username: 'admin', email: 'admin@semop.com', firstName: 'مدير', lastName: 'النظام', isActive: true, roleId: 1 },
            { id: 2, username: 'user1', email: 'user1@semop.com', firstName: 'محمد', lastName: 'أحمد', isActive: true, roleId: 2 },
            { id: 3, username: 'user2', email: 'user2@semop.com', firstName: 'فاطمة', lastName: 'علي', isActive: true, roleId: 2 },
            { id: 4, username: 'user3', email: 'user3@semop.com', firstName: 'سارة', lastName: 'خالد', isActive: false, roleId: 3 },
            { id: 5, username: 'user4', email: 'user4@semop.com', firstName: 'عمر', lastName: 'يوسف', isActive: true, roleId: 3 }
        ];
        this.nextId = 6;
    }
    findAll() {
        return this.users;
    }
    findOne(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    create(createUserDto) {
        const newUser = {
            id: this.nextId++,
            ...createUserDto,
            isActive: true
        };
        this.users.push(newUser);
        return newUser;
    }
    update(id, updateUserDto) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
        return this.users[userIndex];
    }
    remove(id) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.users.splice(userIndex, 1);
        return { message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], UsersService);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const dashboard_controller_1 = __webpack_require__(15);
const dashboard_service_1 = __webpack_require__(16);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService]
    })
], DashboardModule);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const dashboard_service_1 = __webpack_require__(16);
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getStats() {
        return this.dashboardService.getStats();
    }
};
exports.DashboardController = DashboardController;
tslib_1.__decorate([
    (0, common_1.Get)('stats'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], DashboardController.prototype, "getStats", null);
exports.DashboardController = DashboardController = tslib_1.__decorate([
    (0, common_1.Controller)('dashboard'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" ? _a : Object])
], DashboardController);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let DashboardService = class DashboardService {
    getStats() {
        // في الإنتاج يجب جلب البيانات من قاعدة البيانات
        return {
            usersCount: 5,
            rolesCount: 8,
            customersCount: 125,
            suppliersCount: 87
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], DashboardService);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const roles_controller_1 = __webpack_require__(18);
const roles_service_1 = __webpack_require__(19);
let RolesModule = class RolesModule {
};
exports.RolesModule = RolesModule;
exports.RolesModule = RolesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [roles_controller_1.RolesController],
        providers: [roles_service_1.RolesService],
        exports: [roles_service_1.RolesService]
    })
], RolesModule);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const roles_service_1 = __webpack_require__(19);
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    findAll() {
        return this.rolesService.findAll();
    }
    findOne(id) {
        return this.rolesService.findOne(id);
    }
    create(createRoleDto) {
        return this.rolesService.create(createRoleDto);
    }
    update(id, updateRoleDto) {
        return this.rolesService.update(id, updateRoleDto);
    }
    remove(id) {
        return this.rolesService.remove(id);
    }
};
exports.RolesController = RolesController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], RolesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], RolesController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RolesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RolesController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], RolesController.prototype, "remove", null);
exports.RolesController = RolesController = tslib_1.__decorate([
    (0, common_1.Controller)('roles'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof roles_service_1.RolesService !== "undefined" && roles_service_1.RolesService) === "function" ? _a : Object])
], RolesController);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let RolesService = class RolesService {
    constructor() {
        this.roles = [
            { id: 1, name: 'مدير النظام', code: 'ADMIN', description: 'صلاحيات كاملة', isActive: true },
            { id: 2, name: 'مدير مالي', code: 'FINANCE_MANAGER', description: 'إدارة الحسابات والمالية', isActive: true },
            { id: 3, name: 'محاسب', code: 'ACCOUNTANT', description: 'إدخال القيود والتقارير', isActive: true },
            { id: 4, name: 'مدير مشتريات', code: 'PURCHASE_MANAGER', description: 'إدارة المشتريات والموردين', isActive: true },
            { id: 5, name: 'مدير مبيعات', code: 'SALES_MANAGER', description: 'إدارة المبيعات والعملاء', isActive: true },
            { id: 6, name: 'مدير موارد بشرية', code: 'HR_MANAGER', description: 'إدارة الموظفين والرواتب', isActive: true },
            { id: 7, name: 'مدير مخازن', code: 'WAREHOUSE_MANAGER', description: 'إدارة المخزون', isActive: true },
            { id: 8, name: 'مستخدم', code: 'USER', description: 'صلاحيات محدودة', isActive: true }
        ];
        this.nextId = 9;
    }
    findAll() {
        return this.roles;
    }
    findOne(id) {
        const role = this.roles.find(r => r.id === id);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }
    create(createRoleDto) {
        const newRole = {
            id: this.nextId++,
            ...createRoleDto,
            isActive: true
        };
        this.roles.push(newRole);
        return newRole;
    }
    update(id, updateRoleDto) {
        const roleIndex = this.roles.findIndex(r => r.id === id);
        if (roleIndex === -1) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        this.roles[roleIndex] = { ...this.roles[roleIndex], ...updateRoleDto };
        return this.roles[roleIndex];
    }
    remove(id) {
        const roleIndex = this.roles.findIndex(r => r.id === id);
        if (roleIndex === -1) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        this.roles.splice(roleIndex, 1);
        return { message: 'Role deleted successfully' };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], RolesService);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const permissions_controller_1 = __webpack_require__(21);
const permissions_service_1 = __webpack_require__(22);
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [permissions_controller_1.PermissionsController],
        providers: [permissions_service_1.PermissionsService],
        exports: [permissions_service_1.PermissionsService]
    })
], PermissionsModule);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const permissions_service_1 = __webpack_require__(22);
let PermissionsController = class PermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    findAll() {
        return this.permissionsService.findAll();
    }
    findOne(id) {
        return this.permissionsService.findOne(id);
    }
    create(createDto) {
        return this.permissionsService.create(createDto);
    }
    update(id, updateDto) {
        return this.permissionsService.update(id, updateDto);
    }
    remove(id) {
        return this.permissionsService.remove(id);
    }
};
exports.PermissionsController = PermissionsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], PermissionsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], PermissionsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], PermissionsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], PermissionsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], PermissionsController.prototype, "remove", null);
exports.PermissionsController = PermissionsController = tslib_1.__decorate([
    (0, common_1.Controller)('permissions'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof permissions_service_1.PermissionsService !== "undefined" && permissions_service_1.PermissionsService) === "function" ? _a : Object])
], PermissionsController);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let PermissionsService = class PermissionsService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    create(createDto) {
        const newItem = { id: this.nextId++, ...createDto };
        this.items.push(newItem);
        return newItem;
    }
    update(id, updateDto) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items[index] = { ...this.items[index], ...updateDto };
        return this.items[index];
    }
    remove(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items.splice(index, 1);
        return { message: 'Item deleted successfully' };
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], PermissionsService);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HoldingsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const holdings_controller_1 = __webpack_require__(24);
const holdings_service_1 = __webpack_require__(25);
let HoldingsModule = class HoldingsModule {
};
exports.HoldingsModule = HoldingsModule;
exports.HoldingsModule = HoldingsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [holdings_controller_1.HoldingsController],
        providers: [holdings_service_1.HoldingsService],
        exports: [holdings_service_1.HoldingsService]
    })
], HoldingsModule);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HoldingsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const holdings_service_1 = __webpack_require__(25);
let HoldingsController = class HoldingsController {
    constructor(holdingsService) {
        this.holdingsService = holdingsService;
    }
    findAll() {
        return this.holdingsService.findAll();
    }
    findOne(id) {
        return this.holdingsService.findOne(id);
    }
    create(createDto) {
        return this.holdingsService.create(createDto);
    }
    update(id, updateDto) {
        return this.holdingsService.update(id, updateDto);
    }
    remove(id) {
        return this.holdingsService.remove(id);
    }
};
exports.HoldingsController = HoldingsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], HoldingsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], HoldingsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], HoldingsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], HoldingsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], HoldingsController.prototype, "remove", null);
exports.HoldingsController = HoldingsController = tslib_1.__decorate([
    (0, common_1.Controller)('holdings'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof holdings_service_1.HoldingsService !== "undefined" && holdings_service_1.HoldingsService) === "function" ? _a : Object])
], HoldingsController);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HoldingsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let HoldingsService = class HoldingsService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    create(createDto) {
        const newItem = { id: this.nextId++, ...createDto };
        this.items.push(newItem);
        return newItem;
    }
    update(id, updateDto) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items[index] = { ...this.items[index], ...updateDto };
        return this.items[index];
    }
    remove(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items.splice(index, 1);
        return { message: 'Item deleted successfully' };
    }
};
exports.HoldingsService = HoldingsService;
exports.HoldingsService = HoldingsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], HoldingsService);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnitsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const units_controller_1 = __webpack_require__(27);
const units_service_1 = __webpack_require__(28);
let UnitsModule = class UnitsModule {
};
exports.UnitsModule = UnitsModule;
exports.UnitsModule = UnitsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [units_controller_1.UnitsController],
        providers: [units_service_1.UnitsService],
        exports: [units_service_1.UnitsService]
    })
], UnitsModule);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnitsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const units_service_1 = __webpack_require__(28);
let UnitsController = class UnitsController {
    constructor(unitsService) {
        this.unitsService = unitsService;
    }
    findAll() {
        return this.unitsService.findAll();
    }
    findOne(id) {
        return this.unitsService.findOne(id);
    }
    create(createDto) {
        return this.unitsService.create(createDto);
    }
    update(id, updateDto) {
        return this.unitsService.update(id, updateDto);
    }
    remove(id) {
        return this.unitsService.remove(id);
    }
};
exports.UnitsController = UnitsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], UnitsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], UnitsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UnitsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UnitsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], UnitsController.prototype, "remove", null);
exports.UnitsController = UnitsController = tslib_1.__decorate([
    (0, common_1.Controller)('units'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof units_service_1.UnitsService !== "undefined" && units_service_1.UnitsService) === "function" ? _a : Object])
], UnitsController);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnitsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let UnitsService = class UnitsService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    create(createDto) {
        const newItem = { id: this.nextId++, ...createDto };
        this.items.push(newItem);
        return newItem;
    }
    update(id, updateDto) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items[index] = { ...this.items[index], ...updateDto };
        return this.items[index];
    }
    remove(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items.splice(index, 1);
        return { message: 'Item deleted successfully' };
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], UnitsService);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const projects_controller_1 = __webpack_require__(30);
const projects_service_1 = __webpack_require__(31);
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [projects_controller_1.ProjectsController],
        providers: [projects_service_1.ProjectsService],
        exports: [projects_service_1.ProjectsService]
    })
], ProjectsModule);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const projects_service_1 = __webpack_require__(31);
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    findAll() {
        return this.projectsService.findAll();
    }
    findOne(id) {
        return this.projectsService.findOne(id);
    }
    create(createDto) {
        return this.projectsService.create(createDto);
    }
    update(id, updateDto) {
        return this.projectsService.update(id, updateDto);
    }
    remove(id) {
        return this.projectsService.remove(id);
    }
};
exports.ProjectsController = ProjectsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = tslib_1.__decorate([
    (0, common_1.Controller)('projects'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof projects_service_1.ProjectsService !== "undefined" && projects_service_1.ProjectsService) === "function" ? _a : Object])
], ProjectsController);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let ProjectsService = class ProjectsService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    create(createDto) {
        const newItem = { id: this.nextId++, ...createDto };
        this.items.push(newItem);
        return newItem;
    }
    update(id, updateDto) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items[index] = { ...this.items[index], ...updateDto };
        return this.items[index];
    }
    remove(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items.splice(index, 1);
        return { message: 'Item deleted successfully' };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ProjectsService);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const customers_controller_1 = __webpack_require__(33);
const customers_service_1 = __webpack_require__(34);
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [customers_controller_1.CustomersController],
        providers: [customers_service_1.CustomersService],
        exports: [customers_service_1.CustomersService]
    })
], CustomersModule);


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomersController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const customers_service_1 = __webpack_require__(34);
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    findAll() {
        return this.customersService.findAll();
    }
    findOne(id) {
        return this.customersService.findOne(id);
    }
    create(createDto) {
        return this.customersService.create(createDto);
    }
    update(id, updateDto) {
        return this.customersService.update(id, updateDto);
    }
    remove(id) {
        return this.customersService.remove(id);
    }
};
exports.CustomersController = CustomersController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], CustomersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], CustomersController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CustomersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CustomersController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], CustomersController.prototype, "remove", null);
exports.CustomersController = CustomersController = tslib_1.__decorate([
    (0, common_1.Controller)('customers'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof customers_service_1.CustomersService !== "undefined" && customers_service_1.CustomersService) === "function" ? _a : Object])
], CustomersController);


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomersService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let CustomersService = class CustomersService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    create(createDto) {
        const newItem = { id: this.nextId++, ...createDto };
        this.items.push(newItem);
        return newItem;
    }
    update(id, updateDto) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items[index] = { ...this.items[index], ...updateDto };
        return this.items[index];
    }
    remove(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items.splice(index, 1);
        return { message: 'Item deleted successfully' };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CustomersService);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SuppliersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const suppliers_controller_1 = __webpack_require__(36);
const suppliers_service_1 = __webpack_require__(37);
let SuppliersModule = class SuppliersModule {
};
exports.SuppliersModule = SuppliersModule;
exports.SuppliersModule = SuppliersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [suppliers_controller_1.SuppliersController],
        providers: [suppliers_service_1.SuppliersService],
        exports: [suppliers_service_1.SuppliersService]
    })
], SuppliersModule);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SuppliersController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const suppliers_service_1 = __webpack_require__(37);
let SuppliersController = class SuppliersController {
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    findAll() {
        return this.suppliersService.findAll();
    }
    findOne(id) {
        return this.suppliersService.findOne(id);
    }
    create(createDto) {
        return this.suppliersService.create(createDto);
    }
    update(id, updateDto) {
        return this.suppliersService.update(id, updateDto);
    }
    remove(id) {
        return this.suppliersService.remove(id);
    }
};
exports.SuppliersController = SuppliersController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], SuppliersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], SuppliersController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], SuppliersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], SuppliersController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], SuppliersController.prototype, "remove", null);
exports.SuppliersController = SuppliersController = tslib_1.__decorate([
    (0, common_1.Controller)('suppliers'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof suppliers_service_1.SuppliersService !== "undefined" && suppliers_service_1.SuppliersService) === "function" ? _a : Object])
], SuppliersController);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SuppliersService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let SuppliersService = class SuppliersService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    create(createDto) {
        const newItem = { id: this.nextId++, ...createDto };
        this.items.push(newItem);
        return newItem;
    }
    update(id, updateDto) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items[index] = { ...this.items[index], ...updateDto };
        return this.items[index];
    }
    remove(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items.splice(index, 1);
        return { message: 'Item deleted successfully' };
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], SuppliersService);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const items_controller_1 = __webpack_require__(39);
const items_service_1 = __webpack_require__(40);
let ItemsModule = class ItemsModule {
};
exports.ItemsModule = ItemsModule;
exports.ItemsModule = ItemsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [items_controller_1.ItemsController],
        providers: [items_service_1.ItemsService],
        exports: [items_service_1.ItemsService]
    })
], ItemsModule);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const items_service_1 = __webpack_require__(40);
let ItemsController = class ItemsController {
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    findAll() {
        return this.itemsService.findAll();
    }
    findOne(id) {
        return this.itemsService.findOne(id);
    }
    create(createDto) {
        return this.itemsService.create(createDto);
    }
    update(id, updateDto) {
        return this.itemsService.update(id, updateDto);
    }
    remove(id) {
        return this.itemsService.remove(id);
    }
};
exports.ItemsController = ItemsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ItemsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], ItemsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ItemsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ItemsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], ItemsController.prototype, "remove", null);
exports.ItemsController = ItemsController = tslib_1.__decorate([
    (0, common_1.Controller)('items'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof items_service_1.ItemsService !== "undefined" && items_service_1.ItemsService) === "function" ? _a : Object])
], ItemsController);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let ItemsService = class ItemsService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    create(createDto) {
        const newItem = { id: this.nextId++, ...createDto };
        this.items.push(newItem);
        return newItem;
    }
    update(id, updateDto) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items[index] = { ...this.items[index], ...updateDto };
        return this.items[index];
    }
    remove(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        this.items.splice(index, 1);
        return { message: 'Item deleted successfully' };
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ItemsService);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const accounts_controller_1 = __webpack_require__(42);
const accounts_service_1 = __webpack_require__(43);
let AccountsModule = class AccountsModule {
};
exports.AccountsModule = AccountsModule;
exports.AccountsModule = AccountsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [accounts_controller_1.AccountsController],
        providers: [accounts_service_1.AccountsService],
        exports: [accounts_service_1.AccountsService]
    })
], AccountsModule);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const accounts_service_1 = __webpack_require__(43);
let AccountsController = class AccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    findAll(accountType, isActive, isParent) {
        return this.accountsService.findAll({
            accountType,
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            isParent: isParent === 'true' ? true : isParent === 'false' ? false : undefined,
        });
    }
    findOne(id) {
        return this.accountsService.findOne(id);
    }
    create(data) {
        return this.accountsService.create(data);
    }
    update(id, data) {
        return this.accountsService.update(id, data);
    }
    remove(id) {
        return this.accountsService.remove(id);
    }
};
exports.AccountsController = AccountsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('accountType')),
    tslib_1.__param(1, (0, common_1.Query)('isActive')),
    tslib_1.__param(2, (0, common_1.Query)('isParent')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], AccountsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], AccountsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AccountsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AccountsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], AccountsController.prototype, "remove", null);
exports.AccountsController = AccountsController = tslib_1.__decorate([
    (0, common_1.Controller)('accounts'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof accounts_service_1.AccountsService !== "undefined" && accounts_service_1.AccountsService) === "function" ? _a : Object])
], AccountsController);


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AccountsService = class AccountsService {
    constructor() {
        // Dummy data - في الإنتاج يجب استخدام Prisma
        this.accounts = [
            { id: '1', code: '1', nameAr: 'الأصول', nameEn: 'Assets', accountType: 'ASSET', accountNature: 'DEBIT', level: 1, isParent: true, isActive: true },
            { id: '2', code: '11', nameAr: 'الأصول المتداولة', nameEn: 'Current Assets', accountType: 'ASSET', accountNature: 'DEBIT', level: 2, isParent: true, parentId: '1', isActive: true },
            { id: '3', code: '1101', nameAr: 'النقدية', nameEn: 'Cash', accountType: 'ASSET', accountNature: 'DEBIT', level: 3, isParent: false, parentId: '2', isActive: true },
            { id: '4', code: '1102', nameAr: 'البنك', nameEn: 'Bank', accountType: 'ASSET', accountNature: 'DEBIT', level: 3, isParent: false, parentId: '2', isActive: true },
            { id: '5', code: '2', nameAr: 'الخصوم', nameEn: 'Liabilities', accountType: 'LIABILITY', accountNature: 'CREDIT', level: 1, isParent: true, isActive: true },
        ];
        this.nextId = 6;
    }
    findAll(filters) {
        let result = [...this.accounts];
        if (filters?.accountType) {
            result = result.filter(a => a.accountType === filters.accountType);
        }
        if (filters?.isActive !== undefined) {
            result = result.filter(a => a.isActive === filters.isActive);
        }
        if (filters?.isParent !== undefined) {
            result = result.filter(a => a.isParent === filters.isParent);
        }
        return result;
    }
    findOne(id) {
        const account = this.accounts.find(a => a.id === id);
        if (!account) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found`);
        }
        return account;
    }
    create(data) {
        const newAccount = {
            id: String(this.nextId++),
            code: data.code,
            nameAr: data.nameAr,
            nameEn: data.nameEn,
            description: data.description,
            accountType: data.accountType,
            accountNature: data.accountNature,
            level: data.level,
            isParent: data.isParent || false,
            allowManualEntry: data.allowManualEntry ?? true,
            parentId: data.parentId,
            isActive: true,
        };
        this.accounts.push(newAccount);
        return newAccount;
    }
    update(id, data) {
        const index = this.accounts.findIndex(a => a.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found`);
        }
        this.accounts[index] = {
            ...this.accounts[index],
            ...data,
        };
        return this.accounts[index];
    }
    remove(id) {
        const index = this.accounts.findIndex(a => a.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found`);
        }
        // Soft delete
        this.accounts[index].isActive = false;
        return this.accounts[index];
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AccountsService);


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JournalEntriesModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const journal_entries_controller_1 = __webpack_require__(45);
const journal_entries_service_1 = __webpack_require__(46);
let JournalEntriesModule = class JournalEntriesModule {
};
exports.JournalEntriesModule = JournalEntriesModule;
exports.JournalEntriesModule = JournalEntriesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [journal_entries_controller_1.JournalEntriesController],
        providers: [journal_entries_service_1.JournalEntriesService],
        exports: [journal_entries_service_1.JournalEntriesService]
    })
], JournalEntriesModule);


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JournalEntriesController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const journal_entries_service_1 = __webpack_require__(46);
let JournalEntriesController = class JournalEntriesController {
    constructor(journalEntriesService) {
        this.journalEntriesService = journalEntriesService;
    }
    findAll(filters) {
        return this.journalEntriesService.findAll(filters);
    }
    findOne(id) {
        return this.journalEntriesService.findOne(id);
    }
    create(data) {
        return this.journalEntriesService.create(data);
    }
    update(id, data) {
        return this.journalEntriesService.update(id, data);
    }
    remove(id) {
        return this.journalEntriesService.remove(id);
    }
    post(id) {
        return this.journalEntriesService.post(id);
    }
};
exports.JournalEntriesController = JournalEntriesController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "remove", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/post'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], JournalEntriesController.prototype, "post", null);
exports.JournalEntriesController = JournalEntriesController = tslib_1.__decorate([
    (0, common_1.Controller)('journal-entries'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof journal_entries_service_1.JournalEntriesService !== "undefined" && journal_entries_service_1.JournalEntriesService) === "function" ? _a : Object])
], JournalEntriesController);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JournalEntriesService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let JournalEntriesService = class JournalEntriesService {
    constructor() {
        // Dummy data
        this.entries = [
            {
                id: '1',
                entryNumber: 'JE-2025-001',
                date: '2025-01-15',
                description: 'قيد افتتاحي - رأس المال',
                status: 'POSTED',
                totalDebit: 1000000,
                totalCredit: 1000000,
                lines: [
                    { accountId: '3', accountCode: '1101', accountName: 'النقدية', debit: 500000, credit: 0 },
                    { accountId: '4', accountCode: '1102', accountName: 'البنك', debit: 500000, credit: 0 },
                    { accountId: '5', accountCode: '2', accountName: 'رأس المال', debit: 0, credit: 1000000 }
                ]
            },
            {
                id: '2',
                entryNumber: 'JE-2025-002',
                date: '2025-01-20',
                description: 'شراء أصول ثابتة',
                status: 'POSTED',
                totalDebit: 150000,
                totalCredit: 150000,
                lines: [
                    { accountId: '6', accountCode: '1201', accountName: 'أثاث ومعدات', debit: 150000, credit: 0 },
                    { accountId: '4', accountCode: '1102', accountName: 'البنك', debit: 0, credit: 150000 }
                ]
            }
        ];
        this.nextId = 3;
    }
    findAll(filters) {
        let result = [...this.entries];
        if (filters?.status) {
            result = result.filter(e => e.status === filters.status);
        }
        if (filters?.fromDate) {
            result = result.filter(e => e.date >= filters.fromDate);
        }
        if (filters?.toDate) {
            result = result.filter(e => e.date <= filters.toDate);
        }
        return result;
    }
    findOne(id) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) {
            throw new common_1.NotFoundException(`Journal Entry with ID ${id} not found`);
        }
        return entry;
    }
    create(data) {
        const newEntry = {
            id: String(this.nextId++),
            entryNumber: `JE-2025-${String(this.nextId).padStart(3, '0')}`,
            date: data.date,
            description: data.description,
            status: data.status || 'DRAFT',
            totalDebit: data.lines.reduce((sum, line) => sum + (line.debit || 0), 0),
            totalCredit: data.lines.reduce((sum, line) => sum + (line.credit || 0), 0),
            lines: data.lines
        };
        this.entries.push(newEntry);
        return newEntry;
    }
    update(id, data) {
        const index = this.entries.findIndex(e => e.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Journal Entry with ID ${id} not found`);
        }
        this.entries[index] = {
            ...this.entries[index],
            ...data,
            totalDebit: data.lines ? data.lines.reduce((sum, line) => sum + (line.debit || 0), 0) : this.entries[index].totalDebit,
            totalCredit: data.lines ? data.lines.reduce((sum, line) => sum + (line.credit || 0), 0) : this.entries[index].totalCredit
        };
        return this.entries[index];
    }
    remove(id) {
        const index = this.entries.findIndex(e => e.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Journal Entry with ID ${id} not found`);
        }
        const deleted = this.entries[index];
        this.entries.splice(index, 1);
        return deleted;
    }
    post(id) {
        const entry = this.findOne(id);
        entry.status = 'POSTED';
        return entry;
    }
};
exports.JournalEntriesService = JournalEntriesService;
exports.JournalEntriesService = JournalEntriesService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], JournalEntriesService);


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CostCentersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const cost_centers_controller_1 = __webpack_require__(48);
const cost_centers_service_1 = __webpack_require__(49);
let CostCentersModule = class CostCentersModule {
};
exports.CostCentersModule = CostCentersModule;
exports.CostCentersModule = CostCentersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [cost_centers_controller_1.CostCentersController],
        providers: [cost_centers_service_1.CostCentersService],
        exports: [cost_centers_service_1.CostCentersService]
    })
], CostCentersModule);


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CostCentersController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const cost_centers_service_1 = __webpack_require__(49);
let CostCentersController = class CostCentersController {
    constructor(costCentersService) {
        this.costCentersService = costCentersService;
    }
    findAll() {
        return this.costCentersService.findAll();
    }
    findOne(id) {
        return this.costCentersService.findOne(id);
    }
    create(data) {
        return this.costCentersService.create(data);
    }
    update(id, data) {
        return this.costCentersService.update(id, data);
    }
    remove(id) {
        return this.costCentersService.remove(id);
    }
};
exports.CostCentersController = CostCentersController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], CostCentersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], CostCentersController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CostCentersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CostCentersController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], CostCentersController.prototype, "remove", null);
exports.CostCentersController = CostCentersController = tslib_1.__decorate([
    (0, common_1.Controller)('cost-centers'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof cost_centers_service_1.CostCentersService !== "undefined" && cost_centers_service_1.CostCentersService) === "function" ? _a : Object])
], CostCentersController);


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CostCentersService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let CostCentersService = class CostCentersService {
    constructor() {
        // Dummy data
        this.costCenters = [
            {
                id: '1',
                code: 'CC-001',
                nameAr: 'مركز تكلفة المبيعات',
                nameEn: 'Sales Cost Center',
                description: 'مركز تكلفة خاص بقسم المبيعات',
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '2',
                code: 'CC-002',
                nameAr: 'مركز تكلفة الإنتاج',
                nameEn: 'Production Cost Center',
                description: 'مركز تكلفة خاص بقسم الإنتاج',
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '3',
                code: 'CC-003',
                nameAr: 'مركز تكلفة الإدارة',
                nameEn: 'Administration Cost Center',
                description: 'مركز تكلفة خاص بالإدارة العامة',
                isActive: true,
                createdAt: '2025-01-01'
            }
        ];
        this.nextId = 4;
    }
    findAll() {
        return this.costCenters.filter(cc => !cc['isDeleted']);
    }
    findOne(id) {
        const costCenter = this.costCenters.find(cc => cc.id === id && !cc['isDeleted']);
        if (!costCenter) {
            throw new common_1.NotFoundException(`Cost Center with ID ${id} not found`);
        }
        return costCenter;
    }
    create(data) {
        const newCostCenter = {
            id: String(this.nextId++),
            code: data.code,
            nameAr: data.nameAr,
            nameEn: data.nameEn || '',
            description: data.description || '',
            isActive: data.isActive !== undefined ? data.isActive : true,
            createdAt: new Date().toISOString()
        };
        this.costCenters.push(newCostCenter);
        return newCostCenter;
    }
    update(id, data) {
        const index = this.costCenters.findIndex(cc => cc.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Cost Center with ID ${id} not found`);
        }
        this.costCenters[index] = {
            ...this.costCenters[index],
            ...data
        };
        return this.costCenters[index];
    }
    remove(id) {
        const index = this.costCenters.findIndex(cc => cc.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Cost Center with ID ${id} not found`);
        }
        // Soft delete
        this.costCenters[index]['isDeleted'] = true;
        return this.costCenters[index];
    }
};
exports.CostCentersService = CostCentersService;
exports.CostCentersService = CostCentersService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CostCentersService);


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiscalYearsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const fiscal_years_controller_1 = __webpack_require__(51);
const fiscal_years_service_1 = __webpack_require__(52);
let FiscalYearsModule = class FiscalYearsModule {
};
exports.FiscalYearsModule = FiscalYearsModule;
exports.FiscalYearsModule = FiscalYearsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [fiscal_years_controller_1.FiscalYearsController],
        providers: [fiscal_years_service_1.FiscalYearsService],
        exports: [fiscal_years_service_1.FiscalYearsService]
    })
], FiscalYearsModule);


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiscalYearsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const fiscal_years_service_1 = __webpack_require__(52);
let FiscalYearsController = class FiscalYearsController {
    constructor(fiscalYearsService) {
        this.fiscalYearsService = fiscalYearsService;
    }
    findAll() {
        return this.fiscalYearsService.findAll();
    }
    findOne(id) {
        return this.fiscalYearsService.findOne(id);
    }
    create(data) {
        return this.fiscalYearsService.create(data);
    }
    update(id, data) {
        return this.fiscalYearsService.update(id, data);
    }
    remove(id) {
        return this.fiscalYearsService.remove(id);
    }
    close(id) {
        return this.fiscalYearsService.close(id);
    }
};
exports.FiscalYearsController = FiscalYearsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "remove", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/close'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "close", null);
exports.FiscalYearsController = FiscalYearsController = tslib_1.__decorate([
    (0, common_1.Controller)('fiscal-years'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof fiscal_years_service_1.FiscalYearsService !== "undefined" && fiscal_years_service_1.FiscalYearsService) === "function" ? _a : Object])
], FiscalYearsController);


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiscalYearsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let FiscalYearsService = class FiscalYearsService {
    constructor() {
        // Dummy data
        this.fiscalYears = [
            {
                id: '1',
                code: 'FY-2024',
                nameAr: 'السنة المالية 2024',
                nameEn: 'Fiscal Year 2024',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                isClosed: true,
                isActive: false,
                createdAt: '2024-01-01'
            },
            {
                id: '2',
                code: 'FY-2025',
                nameAr: 'السنة المالية 2025',
                nameEn: 'Fiscal Year 2025',
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                isClosed: false,
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '3',
                code: 'FY-2026',
                nameAr: 'السنة المالية 2026',
                nameEn: 'Fiscal Year 2026',
                startDate: '2026-01-01',
                endDate: '2026-12-31',
                isClosed: false,
                isActive: false,
                createdAt: '2025-01-01'
            }
        ];
        this.nextId = 4;
    }
    findAll() {
        return this.fiscalYears.filter(fy => !fy['isDeleted']);
    }
    findOne(id) {
        const fiscalYear = this.fiscalYears.find(fy => fy.id === id && !fy['isDeleted']);
        if (!fiscalYear) {
            throw new common_1.NotFoundException(`Fiscal Year with ID ${id} not found`);
        }
        return fiscalYear;
    }
    create(data) {
        const newFiscalYear = {
            id: String(this.nextId++),
            code: data.code,
            nameAr: data.nameAr,
            nameEn: data.nameEn || '',
            startDate: data.startDate,
            endDate: data.endDate,
            isClosed: false,
            isActive: data.isActive !== undefined ? data.isActive : false,
            createdAt: new Date().toISOString()
        };
        this.fiscalYears.push(newFiscalYear);
        return newFiscalYear;
    }
    update(id, data) {
        const index = this.fiscalYears.findIndex(fy => fy.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Fiscal Year with ID ${id} not found`);
        }
        this.fiscalYears[index] = {
            ...this.fiscalYears[index],
            ...data
        };
        return this.fiscalYears[index];
    }
    remove(id) {
        const index = this.fiscalYears.findIndex(fy => fy.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Fiscal Year with ID ${id} not found`);
        }
        // Soft delete
        this.fiscalYears[index]['isDeleted'] = true;
        return this.fiscalYears[index];
    }
    close(id) {
        const index = this.fiscalYears.findIndex(fy => fy.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Fiscal Year with ID ${id} not found`);
        }
        this.fiscalYears[index].isClosed = true;
        this.fiscalYears[index].isActive = false;
        return this.fiscalYears[index];
    }
};
exports.FiscalYearsService = FiscalYearsService;
exports.FiscalYearsService = FiscalYearsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], FiscalYearsService);


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiscalPeriodsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const fiscal_periods_controller_1 = __webpack_require__(54);
const fiscal_periods_service_1 = __webpack_require__(55);
let FiscalPeriodsModule = class FiscalPeriodsModule {
};
exports.FiscalPeriodsModule = FiscalPeriodsModule;
exports.FiscalPeriodsModule = FiscalPeriodsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [fiscal_periods_controller_1.FiscalPeriodsController],
        providers: [fiscal_periods_service_1.FiscalPeriodsService],
        exports: [fiscal_periods_service_1.FiscalPeriodsService]
    })
], FiscalPeriodsModule);


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiscalPeriodsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const fiscal_periods_service_1 = __webpack_require__(55);
let FiscalPeriodsController = class FiscalPeriodsController {
    constructor(fiscalPeriodsService) {
        this.fiscalPeriodsService = fiscalPeriodsService;
    }
    findAll() {
        return this.fiscalPeriodsService.findAll();
    }
    findOne(id) {
        return this.fiscalPeriodsService.findOne(id);
    }
    create(data) {
        return this.fiscalPeriodsService.create(data);
    }
    update(id, data) {
        return this.fiscalPeriodsService.update(id, data);
    }
    remove(id) {
        return this.fiscalPeriodsService.remove(id);
    }
    close(id, data) {
        return this.fiscalPeriodsService.close(id, data.closedBy);
    }
};
exports.FiscalPeriodsController = FiscalPeriodsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "remove", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/close'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FiscalPeriodsController.prototype, "close", null);
exports.FiscalPeriodsController = FiscalPeriodsController = tslib_1.__decorate([
    (0, common_1.Controller)('fiscal-periods'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof fiscal_periods_service_1.FiscalPeriodsService !== "undefined" && fiscal_periods_service_1.FiscalPeriodsService) === "function" ? _a : Object])
], FiscalPeriodsController);


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiscalPeriodsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let FiscalPeriodsService = class FiscalPeriodsService {
    constructor() {
        // Dummy data
        this.fiscalPeriods = [
            {
                id: '1',
                fiscalYearId: '2',
                code: 'P01-2025',
                nameAr: 'يناير 2025',
                nameEn: 'January 2025',
                startDate: '2025-01-01',
                endDate: '2025-01-31',
                isClosed: true,
                closedBy: 'أحمد محمد',
                closedAt: '2025-02-01',
                createdAt: '2025-01-01'
            },
            {
                id: '2',
                fiscalYearId: '2',
                code: 'P02-2025',
                nameAr: 'فبراير 2025',
                nameEn: 'February 2025',
                startDate: '2025-02-01',
                endDate: '2025-02-28',
                isClosed: true,
                closedBy: 'أحمد محمد',
                closedAt: '2025-03-01',
                createdAt: '2025-02-01'
            },
            {
                id: '3',
                fiscalYearId: '2',
                code: 'P03-2025',
                nameAr: 'مارس 2025',
                nameEn: 'March 2025',
                startDate: '2025-03-01',
                endDate: '2025-03-31',
                isClosed: false,
                closedBy: null,
                closedAt: null,
                createdAt: '2025-03-01'
            },
            {
                id: '4',
                fiscalYearId: '2',
                code: 'P04-2025',
                nameAr: 'أبريل 2025',
                nameEn: 'April 2025',
                startDate: '2025-04-01',
                endDate: '2025-04-30',
                isClosed: false,
                closedBy: null,
                closedAt: null,
                createdAt: '2025-04-01'
            }
        ];
        this.nextId = 5;
    }
    findAll() {
        return this.fiscalPeriods.filter(fp => !fp['isDeleted']);
    }
    findOne(id) {
        const fiscalPeriod = this.fiscalPeriods.find(fp => fp.id === id && !fp['isDeleted']);
        if (!fiscalPeriod) {
            throw new common_1.NotFoundException(`Fiscal Period with ID ${id} not found`);
        }
        return fiscalPeriod;
    }
    create(data) {
        const newFiscalPeriod = {
            id: String(this.nextId++),
            fiscalYearId: data.fiscalYearId,
            code: data.code,
            nameAr: data.nameAr,
            nameEn: data.nameEn || '',
            startDate: data.startDate,
            endDate: data.endDate,
            isClosed: false,
            closedBy: null,
            closedAt: null,
            createdAt: new Date().toISOString()
        };
        this.fiscalPeriods.push(newFiscalPeriod);
        return newFiscalPeriod;
    }
    update(id, data) {
        const index = this.fiscalPeriods.findIndex(fp => fp.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Fiscal Period with ID ${id} not found`);
        }
        this.fiscalPeriods[index] = {
            ...this.fiscalPeriods[index],
            ...data
        };
        return this.fiscalPeriods[index];
    }
    remove(id) {
        const index = this.fiscalPeriods.findIndex(fp => fp.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Fiscal Period with ID ${id} not found`);
        }
        // Soft delete
        this.fiscalPeriods[index]['isDeleted'] = true;
        return this.fiscalPeriods[index];
    }
    close(id, closedBy) {
        const index = this.fiscalPeriods.findIndex(fp => fp.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Fiscal Period with ID ${id} not found`);
        }
        this.fiscalPeriods[index].isClosed = true;
        this.fiscalPeriods[index].closedBy = closedBy;
        this.fiscalPeriods[index].closedAt = new Date().toISOString();
        return this.fiscalPeriods[index];
    }
};
exports.FiscalPeriodsService = FiscalPeriodsService;
exports.FiscalPeriodsService = FiscalPeriodsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], FiscalPeriodsService);


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarehousesModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const warehouses_controller_1 = __webpack_require__(57);
const warehouses_service_1 = __webpack_require__(58);
let WarehousesModule = class WarehousesModule {
};
exports.WarehousesModule = WarehousesModule;
exports.WarehousesModule = WarehousesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [warehouses_controller_1.WarehousesController],
        providers: [warehouses_service_1.WarehousesService],
        exports: [warehouses_service_1.WarehousesService]
    })
], WarehousesModule);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarehousesController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const warehouses_service_1 = __webpack_require__(58);
let WarehousesController = class WarehousesController {
    constructor(warehousesService) {
        this.warehousesService = warehousesService;
    }
    findAll() {
        return this.warehousesService.findAll();
    }
    findOne(id) {
        return this.warehousesService.findOne(id);
    }
    create(createWarehouseDto) {
        return this.warehousesService.create(createWarehouseDto);
    }
    update(id, updateWarehouseDto) {
        return this.warehousesService.update(id, updateWarehouseDto);
    }
    remove(id) {
        return this.warehousesService.remove(id);
    }
};
exports.WarehousesController = WarehousesController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], WarehousesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], WarehousesController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WarehousesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WarehousesController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], WarehousesController.prototype, "remove", null);
exports.WarehousesController = WarehousesController = tslib_1.__decorate([
    (0, common_1.Controller)('warehouses'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof warehouses_service_1.WarehousesService !== "undefined" && warehouses_service_1.WarehousesService) === "function" ? _a : Object])
], WarehousesController);


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarehousesService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let WarehousesService = class WarehousesService {
    constructor() {
        this.warehouses = [
            {
                id: '1',
                code: 'WH-001',
                nameAr: 'المستودع الرئيسي',
                nameEn: 'Main Warehouse',
                location: 'صنعاء - شارع الزبيري',
                managerId: '1',
                managerName: 'أحمد محمد',
                capacity: 10000,
                currentStock: 7500,
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '2',
                code: 'WH-002',
                nameAr: 'مستودع عدن',
                nameEn: 'Aden Warehouse',
                location: 'عدن - المعلا',
                managerId: '2',
                managerName: 'علي حسن',
                capacity: 5000,
                currentStock: 3200,
                isActive: true,
                createdAt: '2025-02-01'
            },
            {
                id: '3',
                code: 'WH-003',
                nameAr: 'مستودع تعز',
                nameEn: 'Taiz Warehouse',
                location: 'تعز - شارع جمال',
                managerId: '3',
                managerName: 'محمد علي',
                capacity: 3000,
                currentStock: 1800,
                isActive: true,
                createdAt: '2025-03-01'
            },
            {
                id: '4',
                code: 'WH-004',
                nameAr: 'مستودع الحديدة',
                nameEn: 'Hodeidah Warehouse',
                location: 'الحديدة - الميناء',
                managerId: '4',
                managerName: 'خالد أحمد',
                capacity: 8000,
                currentStock: 5600,
                isActive: true,
                createdAt: '2025-04-01'
            },
            {
                id: '5',
                code: 'WH-005',
                nameAr: 'مستودع إب',
                nameEn: 'Ibb Warehouse',
                location: 'إب - المدينة',
                managerId: '5',
                managerName: 'عبدالله محمد',
                capacity: 2000,
                currentStock: 1200,
                isActive: false,
                createdAt: '2025-05-01'
            }
        ];
    }
    findAll() {
        return this.warehouses.filter(w => !w['isDeleted']);
    }
    findOne(id) {
        const warehouse = this.warehouses.find(w => w.id === id && !w['isDeleted']);
        if (!warehouse) {
            throw new common_1.NotFoundException(`Warehouse with ID ${id} not found`);
        }
        return warehouse;
    }
    create(createWarehouseDto) {
        const newWarehouse = {
            id: String(this.warehouses.length + 1),
            code: createWarehouseDto.code,
            nameAr: createWarehouseDto.nameAr,
            nameEn: createWarehouseDto.nameEn || '',
            location: createWarehouseDto.location || '',
            managerId: createWarehouseDto.managerId || '',
            managerName: 'مدير جديد',
            capacity: createWarehouseDto.capacity || 0,
            currentStock: 0,
            isActive: createWarehouseDto.isActive !== undefined ? createWarehouseDto.isActive : true,
            createdAt: new Date().toISOString()
        };
        this.warehouses.push(newWarehouse);
        return newWarehouse;
    }
    update(id, updateWarehouseDto) {
        const warehouse = this.findOne(id);
        Object.assign(warehouse, {
            ...updateWarehouseDto,
            updatedAt: new Date().toISOString()
        });
        return warehouse;
    }
    remove(id) {
        const warehouse = this.findOne(id);
        warehouse['isDeleted'] = true;
        return warehouse;
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], WarehousesService);


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StockMovementsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const stock_movements_controller_1 = __webpack_require__(60);
const stock_movements_service_1 = __webpack_require__(61);
let StockMovementsModule = class StockMovementsModule {
};
exports.StockMovementsModule = StockMovementsModule;
exports.StockMovementsModule = StockMovementsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [stock_movements_controller_1.StockMovementsController],
        providers: [stock_movements_service_1.StockMovementsService],
        exports: [stock_movements_service_1.StockMovementsService]
    })
], StockMovementsModule);


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StockMovementsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const stock_movements_service_1 = __webpack_require__(61);
let StockMovementsController = class StockMovementsController {
    constructor(stockMovementsService) {
        this.stockMovementsService = stockMovementsService;
    }
    findAll(warehouseId) {
        return this.stockMovementsService.findAll(warehouseId);
    }
    findOne(id) {
        return this.stockMovementsService.findOne(id);
    }
    create(createStockMovementDto) {
        return this.stockMovementsService.create(createStockMovementDto);
    }
    update(id, updateStockMovementDto) {
        return this.stockMovementsService.update(id, updateStockMovementDto);
    }
    remove(id) {
        return this.stockMovementsService.remove(id);
    }
};
exports.StockMovementsController = StockMovementsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('warehouseId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], StockMovementsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], StockMovementsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], StockMovementsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], StockMovementsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], StockMovementsController.prototype, "remove", null);
exports.StockMovementsController = StockMovementsController = tslib_1.__decorate([
    (0, common_1.Controller)('stock-movements'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof stock_movements_service_1.StockMovementsService !== "undefined" && stock_movements_service_1.StockMovementsService) === "function" ? _a : Object])
], StockMovementsController);


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StockMovementsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let StockMovementsService = class StockMovementsService {
    constructor() {
        this.movements = [
            {
                id: '1',
                warehouseId: '1',
                warehouseName: 'المستودع الرئيسي',
                itemId: '1',
                itemCode: 'ITEM-001',
                itemName: 'لابتوب Dell Latitude',
                movementType: 'IN',
                quantity: 50,
                unitPrice: 800,
                totalValue: 40000,
                referenceType: 'PURCHASE_ORDER',
                referenceId: 'PO-001',
                notes: 'استلام شحنة جديدة',
                createdBy: 'أحمد محمد',
                createdAt: '2025-01-15T10:30:00Z'
            },
            {
                id: '2',
                warehouseId: '1',
                warehouseName: 'المستودع الرئيسي',
                itemId: '2',
                itemCode: 'ITEM-002',
                itemName: 'شاشة Samsung 27"',
                movementType: 'OUT',
                quantity: 10,
                unitPrice: 250,
                totalValue: 2500,
                referenceType: 'SALES_ORDER',
                referenceId: 'SO-001',
                notes: 'بيع للعميل ABC',
                createdBy: 'علي حسن',
                createdAt: '2025-01-16T14:20:00Z'
            },
            {
                id: '3',
                warehouseId: '2',
                warehouseName: 'مستودع عدن',
                itemId: '3',
                itemCode: 'ITEM-003',
                itemName: 'طابعة HP LaserJet',
                movementType: 'IN',
                quantity: 20,
                unitPrice: 300,
                totalValue: 6000,
                referenceType: 'PURCHASE_ORDER',
                referenceId: 'PO-002',
                notes: 'استلام من المورد XYZ',
                createdBy: 'محمد علي',
                createdAt: '2025-02-01T09:15:00Z'
            },
            {
                id: '4',
                warehouseId: '1',
                warehouseName: 'المستودع الرئيسي',
                itemId: '1',
                itemCode: 'ITEM-001',
                itemName: 'لابتوب Dell Latitude',
                movementType: 'TRANSFER',
                quantity: 15,
                unitPrice: 800,
                totalValue: 12000,
                referenceType: 'TRANSFER',
                referenceId: 'TR-001',
                notes: 'نقل إلى مستودع عدن',
                createdBy: 'خالد أحمد',
                createdAt: '2025-02-10T11:45:00Z'
            },
            {
                id: '5',
                warehouseId: '3',
                warehouseName: 'مستودع تعز',
                itemId: '4',
                itemCode: 'ITEM-004',
                itemName: 'ماوس Logitech',
                movementType: 'ADJUSTMENT',
                quantity: -5,
                unitPrice: 15,
                totalValue: -75,
                referenceType: 'ADJUSTMENT',
                referenceId: 'ADJ-001',
                notes: 'تسوية جرد - عجز',
                createdBy: 'عبدالله محمد',
                createdAt: '2025-03-05T16:30:00Z'
            },
            {
                id: '6',
                warehouseId: '1',
                warehouseName: 'المستودع الرئيسي',
                itemId: '5',
                itemCode: 'ITEM-005',
                itemName: 'لوحة مفاتيح Mechanical',
                movementType: 'IN',
                quantity: 100,
                unitPrice: 50,
                totalValue: 5000,
                referenceType: 'PURCHASE_ORDER',
                referenceId: 'PO-003',
                notes: 'شحنة كبيرة',
                createdBy: 'أحمد محمد',
                createdAt: '2025-03-15T08:00:00Z'
            },
            {
                id: '7',
                warehouseId: '2',
                warehouseName: 'مستودع عدن',
                itemId: '2',
                itemCode: 'ITEM-002',
                itemName: 'شاشة Samsung 27"',
                movementType: 'OUT',
                quantity: 8,
                unitPrice: 250,
                totalValue: 2000,
                referenceType: 'SALES_ORDER',
                referenceId: 'SO-002',
                notes: 'بيع محلي',
                createdBy: 'علي حسن',
                createdAt: '2025-04-01T13:20:00Z'
            },
            {
                id: '8',
                warehouseId: '4',
                warehouseName: 'مستودع الحديدة',
                itemId: '6',
                itemCode: 'ITEM-006',
                itemName: 'سماعات Bluetooth',
                movementType: 'IN',
                quantity: 200,
                unitPrice: 30,
                totalValue: 6000,
                referenceType: 'PURCHASE_ORDER',
                referenceId: 'PO-004',
                notes: 'استيراد من الصين',
                createdBy: 'خالد أحمد',
                createdAt: '2025-04-15T10:00:00Z'
            }
        ];
    }
    findAll(warehouseId) {
        let filtered = this.movements.filter(m => !m['isDeleted']);
        if (warehouseId) {
            filtered = filtered.filter(m => m.warehouseId === warehouseId);
        }
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    findOne(id) {
        const movement = this.movements.find(m => m.id === id && !m['isDeleted']);
        if (!movement) {
            throw new common_1.NotFoundException(`Stock movement with ID ${id} not found`);
        }
        return movement;
    }
    create(createDto) {
        const newMovement = {
            id: String(this.movements.length + 1),
            warehouseId: createDto.warehouseId,
            warehouseName: 'مستودع جديد',
            itemId: createDto.itemId,
            itemCode: 'ITEM-NEW',
            itemName: 'صنف جديد',
            movementType: createDto.movementType,
            quantity: createDto.quantity,
            unitPrice: 0,
            totalValue: 0,
            referenceType: createDto.referenceType,
            referenceId: createDto.referenceId,
            notes: createDto.notes,
            createdBy: 'المستخدم الحالي',
            createdAt: new Date().toISOString()
        };
        this.movements.push(newMovement);
        return newMovement;
    }
    update(id, updateDto) {
        const movement = this.findOne(id);
        Object.assign(movement, updateDto);
        return movement;
    }
    remove(id) {
        const movement = this.findOne(id);
        movement['isDeleted'] = true;
        return movement;
    }
};
exports.StockMovementsService = StockMovementsService;
exports.StockMovementsService = StockMovementsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], StockMovementsService);


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenesModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const genes_controller_1 = __webpack_require__(63);
const genes_service_1 = __webpack_require__(64);
let GenesModule = class GenesModule {
};
exports.GenesModule = GenesModule;
exports.GenesModule = GenesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [genes_controller_1.GenesController],
        providers: [genes_service_1.GenesService],
        exports: [genes_service_1.GenesService]
    })
], GenesModule);


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenesController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const genes_service_1 = __webpack_require__(64);
let GenesController = class GenesController {
    constructor(genesService) {
        this.genesService = genesService;
    }
    findAll(category, geneType) {
        return this.genesService.findAll(category, geneType);
    }
    getAvailableGenes(holdingId) {
        return this.genesService.getAvailableGenes(holdingId);
    }
    getActiveGenes(holdingId) {
        return this.genesService.getActiveGenes(holdingId);
    }
    getAllSectors() {
        return this.genesService.getAllSectors();
    }
    findOne(id) {
        return this.genesService.findOne(id);
    }
    create(createGeneDto) {
        return this.genesService.create(createGeneDto);
    }
    activate(id, activateDto) {
        return this.genesService.activate(id, activateDto);
    }
    deactivate(id, body) {
        return this.genesService.deactivate(id, body.holdingId);
    }
    update(id, updateGeneDto) {
        return this.genesService.update(id, updateGeneDto);
    }
    remove(id) {
        return this.genesService.remove(id);
    }
};
exports.GenesController = GenesController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('category')),
    tslib_1.__param(1, (0, common_1.Query)('geneType')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('available'),
    tslib_1.__param(0, (0, common_1.Query)('holdingId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "getAvailableGenes", null);
tslib_1.__decorate([
    (0, common_1.Get)('active'),
    tslib_1.__param(0, (0, common_1.Query)('holdingId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "getActiveGenes", null);
tslib_1.__decorate([
    (0, common_1.Get)('sectors'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "getAllSectors", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/activate'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "activate", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/deactivate'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "deactivate", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], GenesController.prototype, "remove", null);
exports.GenesController = GenesController = tslib_1.__decorate([
    (0, common_1.Controller)('genes'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof genes_service_1.GenesService !== "undefined" && genes_service_1.GenesService) === "function" ? _a : Object])
], GenesController);


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenesService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let GenesService = class GenesService {
    constructor() {
        this.sectors = [
            {
                id: '1',
                code: 'GENERAL',
                nameAr: 'عام',
                nameEn: 'General',
                icon: '📦',
                isActive: true
            },
            {
                id: '2',
                code: 'SUPERMARKET',
                nameAr: 'سوبر ماركت',
                nameEn: 'Supermarket',
                icon: '🏪',
                isActive: true
            },
            {
                id: '3',
                code: 'PHARMACY',
                nameAr: 'صيدلية',
                nameEn: 'Pharmacy',
                icon: '💊',
                isActive: true
            },
            {
                id: '4',
                code: 'RESTAURANT',
                nameAr: 'مطعم',
                nameEn: 'Restaurant',
                icon: '🍔',
                isActive: true
            },
            {
                id: '5',
                code: 'HOSPITAL',
                nameAr: 'مستشفى',
                nameEn: 'Hospital',
                icon: '🏥',
                isActive: true
            }
        ];
        this.genes = [
            // ==================== ACCOUNTING GENES ====================
            // Public Accounting Genes
            {
                id: '1',
                code: 'CASH_MANAGEMENT',
                nameAr: 'حركة الصناديق',
                nameEn: 'Cash Management',
                description: 'إدارة الصناديق وحركات النقد',
                category: 'ACCOUNTING',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '1-1',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة إدارة الصناديق',
                        featureNameEn: 'Cash Management Page',
                        isRequired: true
                    },
                    {
                        id: '1-2',
                        featureType: 'MENU_ITEM',
                        featureNameAr: 'قائمة الصناديق',
                        featureNameEn: 'Cash Menu',
                        isRequired: true
                    },
                    {
                        id: '1-3',
                        featureType: 'REPORT',
                        featureNameAr: 'تقارير الصناديق',
                        featureNameEn: 'Cash Reports',
                        isRequired: false
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '2',
                code: 'CHECK_MANAGEMENT',
                nameAr: 'إدارة الشيكات',
                nameEn: 'Check Management',
                description: 'إدارة الشيكات الصادرة والواردة',
                category: 'ACCOUNTING',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '2-1',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة الشيكات',
                        isRequired: true
                    },
                    {
                        id: '2-2',
                        featureType: 'UI_FIELD',
                        targetPage: 'payments',
                        featureNameAr: 'حقول الشيك (رقم، تاريخ، بنك)',
                        isRequired: true
                    },
                    {
                        id: '2-3',
                        featureType: 'VALIDATION',
                        featureNameAr: 'التحقق من حالة الشيك',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '3',
                code: 'POPULAR_ACCOUNT_NAMES',
                nameAr: 'المسميات الشعبية للحسابات',
                nameEn: 'Popular Account Names',
                description: 'إضافة مسميات شعبية للحسابات المحاسبية',
                category: 'ACCOUNTING',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '3-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'accounts',
                        featureNameAr: 'حقل المسمى الشعبي',
                        isRequired: true
                    },
                    {
                        id: '3-2',
                        featureType: 'UI_FIELD',
                        targetPage: 'accounts',
                        featureNameAr: 'البحث بالمسمى الشعبي',
                        isRequired: false
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '4',
                code: 'VAULT_MANAGEMENT',
                nameAr: 'إدارة الخزائن',
                nameEn: 'Vault Management',
                description: 'إدارة الخزائن والأموال المحفوظة',
                category: 'ACCOUNTING',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '4-1',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة الخزائن',
                        isRequired: true
                    },
                    {
                        id: '4-2',
                        featureType: 'REPORT',
                        featureNameAr: 'تقارير الخزائن',
                        isRequired: false
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            // Private Accounting Genes - Pharmacy
            {
                id: '5',
                code: 'PHARMACY_MOH_REPORTS',
                nameAr: 'تقارير وزارة الصحة',
                nameEn: 'Ministry of Health Reports',
                description: 'تقارير محاسبية خاصة بوزارة الصحة',
                category: 'ACCOUNTING',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '5-1',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير المبيعات الدوائية الشهري',
                        isRequired: true
                    },
                    {
                        id: '5-2',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير الأدوية المخدرة',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '6',
                code: 'MEDICAL_BILLING',
                nameAr: 'الفوترة الطبية',
                nameEn: 'Medical Billing',
                description: 'نظام فوترة خاص بالصيدليات',
                category: 'ACCOUNTING',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '6-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'invoices',
                        featureNameAr: 'حقول التأمين الطبي',
                        isRequired: true
                    },
                    {
                        id: '6-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'التحقق من بطاقة التأمين',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            // ==================== INVENTORY GENES ====================
            // Public Inventory Genes
            {
                id: '7',
                code: 'BASIC_BARCODE',
                nameAr: 'الباركود الأساسي',
                nameEn: 'Basic Barcode',
                description: 'نظام باركود أساسي للأصناف',
                category: 'INVENTORY',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '7-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'items',
                        featureNameAr: 'حقل الباركود',
                        isRequired: true
                    },
                    {
                        id: '7-2',
                        featureType: 'PAGE',
                        featureNameAr: 'طباعة الباركود',
                        isRequired: false
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '8',
                code: 'PERIODIC_INVENTORY',
                nameAr: 'الجرد الدوري',
                nameEn: 'Periodic Inventory',
                description: 'نظام جرد دوري متقدم',
                category: 'INVENTORY',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '8-1',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة الجرد الدوري',
                        isRequired: true
                    },
                    {
                        id: '8-2',
                        featureType: 'WORKFLOW',
                        featureNameAr: 'سير عمل الجرد',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '9',
                code: 'REORDER_POINT',
                nameAr: 'حد إعادة الطلب',
                nameEn: 'Reorder Point',
                description: 'تنبيهات تلقائية عند الوصول لحد إعادة الطلب',
                category: 'INVENTORY',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '9-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'items',
                        featureNameAr: 'حقل حد إعادة الطلب',
                        isRequired: true
                    },
                    {
                        id: '9-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'تنبيه عند الوصول للحد',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            // Private Inventory Genes - Pharmacy
            {
                id: '10',
                code: 'EXPIRY_DATE_MANAGEMENT',
                nameAr: 'إدارة تواريخ الصلاحية',
                nameEn: 'Expiry Date Management',
                description: 'نظام إلزامي لتتبع تواريخ صلاحية الأدوية',
                category: 'INVENTORY',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '10-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'items',
                        featureNameAr: 'حقول تاريخ الإنتاج والصلاحية (إلزامي)',
                        isRequired: true
                    },
                    {
                        id: '10-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'منع البيع للأصناف منتهية الصلاحية',
                        isRequired: true
                    },
                    {
                        id: '10-3',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير الأصناف قريبة الصلاحية',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '11',
                code: 'DRUG_CLASSIFICATION',
                nameAr: 'التصنيف الدوائي',
                nameEn: 'Drug Classification',
                description: 'تصنيف الأدوية حسب النوع والمجموعة الدوائية',
                category: 'INVENTORY',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '11-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'items',
                        featureNameAr: 'حقول التصنيف الدوائي',
                        isRequired: true
                    },
                    {
                        id: '11-2',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة إدارة التصنيفات الدوائية',
                        isRequired: false
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '12',
                code: 'PRESCRIPTION_MANAGEMENT',
                nameAr: 'إدارة الوصفات الطبية',
                nameEn: 'Prescription Management',
                description: 'نظام إدارة الوصفات الطبية',
                category: 'INVENTORY',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '12-1',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة الوصفات الطبية',
                        isRequired: true
                    },
                    {
                        id: '12-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'التحقق من الوصفة قبل الصرف',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '13',
                code: 'DRUG_INTERACTION_ALERTS',
                nameAr: 'تنبيهات التفاعلات الدوائية',
                nameEn: 'Drug Interaction Alerts',
                description: 'تنبيهات عند وجود تفاعلات دوائية خطرة',
                category: 'INVENTORY',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '13-1',
                        featureType: 'VALIDATION',
                        featureNameAr: 'التحقق من التفاعلات الدوائية',
                        isRequired: true
                    },
                    {
                        id: '13-2',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير التفاعلات الدوائية',
                        isRequired: false
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '14',
                code: 'CONTROLLED_DRUGS',
                nameAr: 'إدارة الأدوية المخدرة',
                nameEn: 'Controlled Drugs Management',
                description: 'نظام خاص لإدارة الأدوية المخدرة والمراقبة',
                category: 'INVENTORY',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '14-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'items',
                        featureNameAr: 'علامة دواء مخدر',
                        isRequired: true
                    },
                    {
                        id: '14-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'قيود صارمة على الصرف',
                        isRequired: true
                    },
                    {
                        id: '14-3',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير الأدوية المخدرة',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            // Private Inventory Genes - Supermarket
            {
                id: '15',
                code: 'SHELF_AISLE_MANAGEMENT',
                nameAr: 'إدارة الأرفف والممرات',
                nameEn: 'Shelf & Aisle Management',
                description: 'نظام إدارة الأرفف والممرات في السوبر ماركت',
                category: 'INVENTORY',
                geneType: 'PRIVATE',
                sectorId: '2',
                sectorName: 'سوبر ماركت',
                features: [
                    {
                        id: '15-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'items',
                        featureNameAr: 'حقول رقم الرف والممر',
                        isRequired: true
                    },
                    {
                        id: '15-2',
                        featureType: 'PAGE',
                        featureNameAr: 'خريطة المستودع',
                        isRequired: false
                    },
                    {
                        id: '15-3',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير الأصناف حسب الرف',
                        isRequired: false
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '16',
                code: 'WEIGHT_SYSTEM',
                nameAr: 'نظام الوزن',
                nameEn: 'Weight System',
                description: 'نظام وزن للخضار والفواكه',
                category: 'INVENTORY',
                geneType: 'PRIVATE',
                sectorId: '2',
                sectorName: 'سوبر ماركت',
                features: [
                    {
                        id: '16-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'items',
                        featureNameAr: 'علامة صنف بالوزن',
                        isRequired: true
                    },
                    {
                        id: '16-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'حساب السعر حسب الوزن',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            // ==================== SALES GENES ====================
            // Public Sales Genes
            {
                id: '17',
                code: 'LOYALTY_POINTS',
                nameAr: 'نظام النقاط',
                nameEn: 'Loyalty Points',
                description: 'نظام نقاط الولاء للعملاء',
                category: 'SALES',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '17-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'customers',
                        featureNameAr: 'حقل النقاط',
                        isRequired: true
                    },
                    {
                        id: '17-2',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة إدارة النقاط',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '18',
                code: 'ADVANCED_DISCOUNTS',
                nameAr: 'الخصومات المتقدمة',
                nameEn: 'Advanced Discounts',
                description: 'نظام خصومات متقدم (نسبة، مبلغ، شرطي)',
                category: 'SALES',
                geneType: 'PUBLIC',
                features: [
                    {
                        id: '18-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'invoices',
                        featureNameAr: 'أنواع خصومات متعددة',
                        isRequired: true
                    },
                    {
                        id: '18-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'قواعد الخصومات',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            // Private Sales Genes - Pharmacy
            {
                id: '19',
                code: 'MEDICAL_INSURANCE',
                nameAr: 'نظام التأمين الطبي',
                nameEn: 'Medical Insurance System',
                description: 'نظام التأمين الطبي للصيدليات',
                category: 'SALES',
                geneType: 'PRIVATE',
                sectorId: '3',
                sectorName: 'صيدلية',
                features: [
                    {
                        id: '19-1',
                        featureType: 'UI_FIELD',
                        targetPage: 'invoices',
                        featureNameAr: 'حقول التأمين',
                        isRequired: true
                    },
                    {
                        id: '19-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'التحقق من التغطية التأمينية',
                        isRequired: true
                    },
                    {
                        id: '19-3',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير مطالبات التأمين',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            // Private Sales Genes - Supermarket
            {
                id: '20',
                code: 'PROMOTIONAL_OFFERS',
                nameAr: 'العروض الترويجية',
                nameEn: 'Promotional Offers',
                description: 'نظام عروض (2+1، اشتري واحصل على الثاني)',
                category: 'SALES',
                geneType: 'PRIVATE',
                sectorId: '2',
                sectorName: 'سوبر ماركت',
                features: [
                    {
                        id: '20-1',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة إدارة العروض',
                        isRequired: true
                    },
                    {
                        id: '20-2',
                        featureType: 'VALIDATION',
                        featureNameAr: 'تطبيق العروض تلقائياً',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '21',
                code: 'QUICK_POS',
                nameAr: 'نقاط البيع السريعة',
                nameEn: 'Quick POS',
                description: 'نظام نقاط بيع سريع للسوبر ماركت',
                category: 'SALES',
                geneType: 'PRIVATE',
                sectorId: '2',
                sectorName: 'سوبر ماركت',
                features: [
                    {
                        id: '21-1',
                        featureType: 'PAGE',
                        featureNameAr: 'واجهة POS سريعة',
                        isRequired: true
                    },
                    {
                        id: '21-2',
                        featureType: 'UI_FIELD',
                        featureNameAr: 'مسح باركود سريع',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            },
            {
                id: '22',
                code: 'CASHIER_SHIFTS',
                nameAr: 'إدارة الكاشير والورديات',
                nameEn: 'Cashier & Shifts Management',
                description: 'نظام إدارة الكاشير والورديات',
                category: 'SALES',
                geneType: 'PRIVATE',
                sectorId: '2',
                sectorName: 'سوبر ماركت',
                features: [
                    {
                        id: '22-1',
                        featureType: 'PAGE',
                        featureNameAr: 'صفحة الورديات',
                        isRequired: true
                    },
                    {
                        id: '22-2',
                        featureType: 'REPORT',
                        featureNameAr: 'تقرير مبيعات الكاشير',
                        isRequired: true
                    }
                ],
                isActive: true,
                createdAt: '2025-01-01'
            }
        ];
        this.activations = [];
    }
    getAllSectors() {
        return this.sectors.filter(s => s.isActive);
    }
    findAll(category, geneType) {
        let filtered = this.genes.filter(g => g.isActive);
        if (category) {
            filtered = filtered.filter(g => g.category === category);
        }
        if (geneType) {
            filtered = filtered.filter(g => g.geneType === geneType);
        }
        return filtered;
    }
    getAvailableGenes(holdingId) {
        // في الإنتاج، نجلب قطاع العميل من قاعدة البيانات
        // هنا نفترض أن العميل من قطاع الصيدليات للتجربة
        const holdingSectorId = '3'; // Pharmacy
        return this.genes.filter(g => g.isActive && (g.geneType === 'PUBLIC' ||
            g.sectorId === holdingSectorId));
    }
    getActiveGenes(holdingId) {
        return this.activations.filter(a => a.holdingId === holdingId && a.isActive);
    }
    findOne(id) {
        const gene = this.genes.find(g => g.id === id && g.isActive);
        if (!gene) {
            throw new common_1.NotFoundException(`Gene with ID ${id} not found`);
        }
        return gene;
    }
    create(createDto) {
        const newGene = {
            id: String(this.genes.length + 1),
            code: createDto.code,
            nameAr: createDto.nameAr,
            nameEn: createDto.nameEn,
            description: createDto.description,
            category: createDto.category,
            geneType: createDto.geneType,
            sectorId: createDto.sectorId,
            features: createDto.features || [],
            isActive: true,
            createdAt: new Date().toISOString()
        };
        if (newGene.sectorId) {
            const sector = this.sectors.find(s => s.id === newGene.sectorId);
            if (sector) {
                newGene.sectorName = sector.nameAr;
            }
        }
        this.genes.push(newGene);
        return newGene;
    }
    activate(geneId, activateDto) {
        const gene = this.findOne(geneId);
        // Check if already activated
        const existing = this.activations.find(a => a.geneId === geneId &&
            a.holdingId === activateDto.holdingId &&
            a.isActive);
        if (existing) {
            return existing;
        }
        const activation = {
            id: String(this.activations.length + 1),
            geneId: geneId,
            geneName: gene.nameAr,
            holdingId: activateDto.holdingId,
            activatedBy: 'admin',
            activatedAt: new Date().toISOString(),
            config: activateDto.config,
            isActive: true
        };
        this.activations.push(activation);
        return activation;
    }
    deactivate(geneId, holdingId) {
        const activation = this.activations.find(a => a.geneId === geneId &&
            a.holdingId === holdingId &&
            a.isActive);
        if (!activation) {
            throw new common_1.NotFoundException('Activation not found');
        }
        activation.isActive = false;
        return activation;
    }
    update(id, updateDto) {
        const gene = this.findOne(id);
        Object.assign(gene, updateDto);
        return gene;
    }
    remove(id) {
        const gene = this.findOne(id);
        gene.isActive = false;
        return gene;
    }
};
exports.GenesService = GenesService;
exports.GenesService = GenesService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], GenesService);


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentationModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const documentation_controller_1 = __webpack_require__(66);
const documentation_service_1 = __webpack_require__(68);
let DocumentationModule = class DocumentationModule {
};
exports.DocumentationModule = DocumentationModule;
exports.DocumentationModule = DocumentationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [documentation_controller_1.DocumentationController],
        providers: [documentation_service_1.DocumentationService],
        exports: [documentation_service_1.DocumentationService],
    })
], DocumentationModule);


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentationController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const express_1 = __webpack_require__(67);
const documentation_service_1 = __webpack_require__(68);
let DocumentationController = class DocumentationController {
    constructor(documentationService) {
        this.documentationService = documentationService;
    }
    /**
     * Get list of all available documentation files
     */
    async getAllDocuments() {
        return this.documentationService.getAllDocuments();
    }
    /**
     * Get specific documentation file content
     */
    async getDocument(filename, res) {
        try {
            const content = await this.documentationService.getDocumentContent(filename);
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                filename,
                content,
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({
                success: false,
                message: `Document not found: ${filename}`,
            });
        }
    }
    /**
     * Get SEMOP Master Blueprint
     */
    async getMasterBlueprint(res) {
        try {
            const content = await this.documentationService.getMasterBlueprint();
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                filename: 'SEMOP_MASTER_BLUEPRINT.md',
                content,
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Master Blueprint not found',
            });
        }
    }
};
exports.DocumentationController = DocumentationController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentationController.prototype, "getAllDocuments", null);
tslib_1.__decorate([
    (0, common_1.Get)(':filename'),
    tslib_1.__param(0, (0, common_1.Param)('filename')),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentationController.prototype, "getDocument", null);
tslib_1.__decorate([
    (0, common_1.Get)('master/blueprint'),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentationController.prototype, "getMasterBlueprint", null);
exports.DocumentationController = DocumentationController = tslib_1.__decorate([
    (0, common_1.Controller)('documentation'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof documentation_service_1.DocumentationService !== "undefined" && documentation_service_1.DocumentationService) === "function" ? _a : Object])
], DocumentationController);


/***/ }),
/* 67 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentationService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const fs_1 = __webpack_require__(69);
const path = tslib_1.__importStar(__webpack_require__(70));
let DocumentationService = class DocumentationService {
    constructor() {
        this.docsPath = path.join(process.cwd(), '../../');
    }
    /**
     * Get list of all available documentation files
     */
    async getAllDocuments() {
        return [
            {
                id: 'master-blueprint',
                title: 'دليل بناء النظام الشامل',
                filename: 'SEMOP_MASTER_BLUEPRINT.md',
                description: 'المخطط الرئيسي لنظام SEMOP - البنية المعمارية والأنظمة الفرعية',
                category: 'developer',
                icon: 'pi-sitemap',
                version: '2.0.0',
                lastUpdated: '2025-11-21',
                pages: 30,
                sections: 11,
            },
            {
                id: 'user-guide',
                title: 'دليل المستخدم',
                filename: 'USER_GUIDE.md',
                description: 'دليل شامل لاستخدام النظام',
                category: 'user',
                icon: 'pi-user',
                version: '1.0.0',
            },
            {
                id: 'api-reference',
                title: 'مرجع API',
                filename: 'API_REFERENCE.md',
                description: 'توثيق كامل لجميع APIs',
                category: 'developer',
                icon: 'pi-code',
                version: '1.0.0',
            },
        ];
    }
    /**
     * Get specific documentation file content
     */
    async getDocumentContent(filename) {
        const filePath = path.join(this.docsPath, filename);
        try {
            const content = await fs_1.promises.readFile(filePath, 'utf-8');
            return content;
        }
        catch (error) {
            throw new Error(`Document not found: ${filename}`);
        }
    }
    /**
     * Get SEMOP Master Blueprint
     */
    async getMasterBlueprint() {
        return this.getDocumentContent('SEMOP_MASTER_BLUEPRINT.md');
    }
};
exports.DocumentationService = DocumentationService;
exports.DocumentationService = DocumentationService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], DocumentationService);


/***/ }),
/* 69 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 70 */
/***/ ((module) => {

module.exports = require("path");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;