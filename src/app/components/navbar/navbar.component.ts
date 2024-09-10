import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  dropdownOpen = false;
  mobileDropdownOpen = false;

  categories = [
    { name: 'Home', url: 'home', subcategories: null, showDropdown: false },
    {
      name: 'Category', url: '', showDropdown: false,
      subcategories: [
        { name: 'Action', url: 'category/action' },
        { name: 'Adventure', url: 'category/adventure' },
        { name: 'Comedy', url: 'category/comedy' },
        { name: 'Fantasy', url: 'category/fantasy' },
        { name: 'Mystery', url: 'category/mystery' },
        { name: 'Superhero', url: 'category/superhero' },
        { name: 'Romance', url: 'category/romance' },
      ]
    },
    { name: 'Request a Movie', url: 'request', subcategories: null, showDropdown: false },
  ];

  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeSidebar();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarOpen ? this.closeSidebar() : this.sidebarOpen = true;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileDropdown() {
    this.mobileDropdownOpen = !this.mobileDropdownOpen;
  }

  showDropdown(category: any) {
    category.showDropdown = true;
  }

  hideDropdown(category: any) {
    category.showDropdown = false;
  }

  selectCategory(categoryName: string) {
    console.log('Selected category:', categoryName);
    const formattedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate(['/category', formattedCategory]).then(() => {
      this.closeSidebar();
    });
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.mobileDropdownOpen = false;
  }
}