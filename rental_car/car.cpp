

typedef struct User
{
    char name[100];
    char email[100];
    char mobile[10];
    char address_line_1[100];
    char address_line_2[100];
    char city[25];
    char state[100];
    char password[25];
}User;



typedef struct CarBill {
    User user;
    char Model[25];
    char VheicleNo[25];
    int BillAmt;
}CarBill;

class Car{
    private:
        char Model[25];
        char VheicleNo[25];
        int PerDayRent;
    public:
        Car(char modal[25],char vheicleno[25],int perdayrent){
            // Model = modal;
            // VheicleNo = vheicleno;
            PerDayRent = perdayrent;
        }
        CarBill RentCar(int days){
            CarBill cb;
            // cb.Model = Model;
            // cb.VheicleNo = VheicleNo;
            cb.BillAmt = PerDayRent*days;
        }
};

void CarManager(){
    
}