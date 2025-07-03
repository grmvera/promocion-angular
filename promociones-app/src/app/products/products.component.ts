import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../core/models/product';
import { User } from '../core/models/user';
import { ProductService } from '../core/services/product.service';

interface PromoItem {
  id: number;
  name: string;
  quantity: number;
  listPrice: number;
  promoPrice: number;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  currentUser: User | null = null;
  products: Product[] = [];
  promoList: PromoItem[] = [];

  isAnalyst = false;
  isManager = false;

  selectedProductId: number | null = null;
  selectedQuantity: number | null = null;
  selectedPromoPrice: number | null = null;

  errorMessage = '';
  successMessage = '';
  approvalStatus: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
      this.isAnalyst = this.currentUser?.role === 'analyst';
      this.isManager = this.currentUser?.role === 'manager';
    }

    this.productService.getProducts().subscribe(products => {
      this.products = products;

      const promo = localStorage.getItem('promoList');
      this.promoList = promo ? JSON.parse(promo) : [];
    });
  }

  hasRejectedItems(): boolean {
    return this.promoList.some(p => p.status === 'rejected');
  }

  addProduct() {
    this.clearMessages();

    const product = this.products.find(p => p.id === this.selectedProductId);
    if (!product) {
      this.errorMessage = 'Debes seleccionar un producto.';
      return;
    }

    if (this.promoList.some(p => p.id === product.id)) {
      this.errorMessage = 'Este producto ya está en la lista.';
      return;
    }

    if (
      this.selectedQuantity == null ||
      this.selectedQuantity < product.minPromotionQuantity ||
      this.selectedQuantity > product.maxPromotionQuantity
    ) {
      this.errorMessage = `La cantidad debe estar entre ${product.minPromotionQuantity} y ${product.maxPromotionQuantity}.`;
      return;
    }

    if (
      this.selectedPromoPrice == null ||
      this.selectedPromoPrice < product.minPromotionPrice ||
      this.selectedPromoPrice >= product.listPrice
    ) {
      this.errorMessage = `El precio promocional debe ser mayor o igual a ${product.minPromotionPrice} y menor que ${product.listPrice}.`;
      return;
    }

    this.promoList.push({
      id: product.id,
      name: product.name,
      quantity: this.selectedQuantity,
      listPrice: product.listPrice,
      promoPrice: this.selectedPromoPrice,
      status: 'pending'
    });

    this.successMessage = 'Producto agregado a la lista.';
    this.updateStorage();

    this.selectedProductId = null;
    this.selectedQuantity = null;
    this.selectedPromoPrice = null;
  }

  approveItem(item: PromoItem) {
    item.status = 'approved';
    this.successMessage = `Producto "${item.name}" aprobado.`;
    this.updateStorage();
  }

  rejectItem(item: PromoItem) {
    item.status = 'rejected';
    this.successMessage = `Producto "${item.name}" rechazado.`;

    if (this.isManager) {
      // Eliminarlo de la lista visible del manager
      this.promoList = this.promoList.filter(p => p.id !== item.id);
    }

    this.updateStorage();
  }

  deleteItem(item: PromoItem) {
    this.promoList = this.promoList.filter(p => p.id !== item.id);
    this.successMessage = `Producto "${item.name}" eliminado.`;
    this.updateStorage();
  }

  approveAll() {
    if (this.promoList.some(p => p.status === 'rejected')) {
      this.errorMessage = 'No puedes aprobar la lista mientras existan productos rechazados.';
      return;
    }

    for (const item of this.promoList) {
      item.status = 'approved';
    }

    this.approvalStatus = 'Aprobado';
    this.successMessage = '¡Todas las promociones han sido aprobadas!';
    this.updateStorage();
  }

  sendToEdit() {
    this.approvalStatus = null;
    this.successMessage = 'La lista ha sido devuelta a edición.';
    this.updateStorage();
  }

  sendPromos() {
    localStorage.setItem('promoList', JSON.stringify(this.promoList));
    this.successMessage = '¡Lista enviada a aprobación!';
    this.approvalStatus = 'En aprobación';
  }

  isEditable(item: PromoItem) {
    return this.isAnalyst && (item.status === 'pending' || item.status === 'rejected');
  }

  updateStorage() {
    localStorage.setItem('promoList', JSON.stringify(this.promoList));
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
