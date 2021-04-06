import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { Payment } from 'src/app/models/payment';
import { Rental } from 'src/app/models/rental';
import { CarDetailService } from 'src/app/services/car-detail.service';
import { CarService } from 'src/app/services/car.service';
import { PaymentService } from 'src/app/services/payment.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  carToBeRented: Rental;
  payment: Payment;

  carDetail: CarDetail[]=[];
  carBrandName: string;
  carModelYear: number;

  cardName!: string;
  cardNumber!: string;
  cardDateMonth!: string;
  cardDateYear!: string;
  cardDate: string;
  cardCvv!: string;
  amountPaye: number;

  returnPayAddMessega: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private rentalService: RentalService,
    private paymentService: PaymentService,
    private carService: CarService,
    private carDetailService: CarDetailService
  ) {}

  ngOnInit(): void {
    this.carToBeRented = this.paymentService.getRental();
    this.amountPaye = this.paymentService.getRentalAmountPaye();

    if ( (this.carToBeRented === undefined) || (this.amountPaye <= 0) ){
      this.router.navigate(['/cars']);
      this.toastrService.error("Araç listesine yönlendiriliyorsunuz", "Hatalı işlem");
    }

    this.getCarDetailById(this.carToBeRented.carId);
  }
  

  getCarDetailById(carId: number) {
    this.carDetailService.getCarDetailByCarId(carId).subscribe((response) => {
      this.carDetail = response.data;
      this.carBrandName = this.carDetail[0].brandName;
      this.carModelYear = this.carDetail[0].modelYear;
    });
  }

  createPayment(){
    if ( (this.cardName === undefined) || (!this.cardName) ) {
      this.toastrService.warning('Kart Sahibi bilgisini kontrol ediniz.');
    }
    else if ( (this.cardNumber === undefined) || (!this.cardNumber) ){
      this.toastrService.warning('Kart Numarası bilgisini kontrol ediniz.');
    }
    else if ( (this.cardDateMonth === undefined) || (!this.cardDateMonth) )  {
      this.toastrService.warning('Tarih Ay bilgisini kontrol ediniz.');
    }
    else if ( (this.cardDateYear === undefined) || (!this.cardDateYear) )  {
      this.toastrService.warning('Tarih Yıl bilgisini kontrol ediniz.');
    }
    else if ( (this.cardCvv === undefined) || (!this.cardCvv)  ) {
      this.toastrService.warning('CVV bilgisini kontrol ediniz.');
    }
    else{
      this.cardDate = this.cardDateMonth + "/" + this.cardDateYear;

      this.payment = {
        cardNameSurname : this.cardName,
        cardNumber : this.cardNumber,
        cardExpiryDate : this.cardDate,
        cardCvv : this.cardCvv.toString(),
        amountPaye : this.amountPaye
      }

      this.paymentService.add(this.payment).subscribe(
        (response) => {
          var splitted = response.message.toString();
          this.returnPayAddMessega = splitted; 
          
          this.toastrService.success(this.returnPayAddMessega, "Ödeme Başarılı");

          console.log(this.carToBeRented.carId);
          this.carToBeRented={
            carId:Number(this.carToBeRented.carId),
            customerId:Number(this.carToBeRented.customerId),
            rentDate:this.carToBeRented.rentDate,
            returnDate:this.carToBeRented.returnDate
          };

          this.rentalService.addRent(this.carToBeRented).subscribe(
            (response2) => {
            this.toastrService.success(response2.message.toString(), "Kiralama Başarılı");
            this.router.navigate(['/cars']);
            },
            (error) => {
            this.toastrService.error('Kiralama İşlemi Yapılamadı.','Kiralama Başarısız');
            console.log(error)
            }
          )
        },
        (error) => {
          this.toastrService.error("Ödeme Başarısız");
          console.log(error)
        }
      )
    } 
  }
}
