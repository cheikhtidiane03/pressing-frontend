import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { LucideAngularModule } from 'lucide-angular';
import {
  LayoutDashboard, Inbox, Send, ClipboardList, Building2, Users, Archive, BarChart3,
  Settings, Bell, LogOut, ChevronDown, ChevronRight, Search, Plus, Pencil, Trash2,
  Upload, Download, Check, X, Sun, Moon, CircleCheck, CircleX, Info, TriangleAlert,
  CircleHelp, School, FileText, GraduationCap, ListChecks, CalendarDays, Award,
  UserPlus, ShieldCheck, DoorOpen, RefreshCw, Eye, LayoutGrid, Menu, Zap, ArrowLeft,
  ArrowRight, CircleUserRound, KeyRound, Phone, IdCard
} from 'lucide-angular';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    importProvidersFrom(NgChartsModule),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard, Inbox, Send, ClipboardList, Building2, Users, Archive, BarChart3,
        Settings, Bell, LogOut, ChevronDown, ChevronRight, Search, Plus, Pencil, Trash2,
        Upload, Download, Check, X, Sun, Moon, CircleCheck, CircleX, Info, TriangleAlert,
        CircleHelp, School, FileText, GraduationCap, ListChecks, CalendarDays, Award,
        UserPlus, ShieldCheck, DoorOpen, RefreshCw, Eye, LayoutGrid, Menu, Zap, ArrowLeft,
        ArrowRight, CircleUserRound, KeyRound, Phone, IdCard
      })
    )
  ]
};
