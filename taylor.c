double calculateFm(int m, double sp2, double a, int nBar) {
 
	int i, j, n[nBar - 1][1], p[nBar - 1][1];	 
	double Num[nBar - 1][1], Den[nBar - 1][1], Fm[nBar - 1][1], prodNum = 1,
	 
	prodDen = 1, prodFm = 0.0;
	 
	for (i = 0; i < nBar - 1; i++) {
	 
		for (j = 0; j < 1; j++) {  
			n[i][j] = i + 1;  
			p[i][j] = i + 1;  
			Fm[i][j] = 0; 
			    
			Num[i][j] = 1 - (((m * m) / sp2)) / (a * a + (n[i][j] - 0.5) * ((n[i][j]) - 0.5));    
			 
			prodNum = prodNum * Num[i][j];  
			 
			Den[i][j] = 1 - (m * m / (double) (p[i][j] * p[i][j]));
			      
			if ((i + 1) != m) {  
				prodDen = prodDen * Den[i][j];  
			}		  
		}	 
	}    
	prodFm = ((pow(-1, (m + 1)) * prodNum) / (2 * prodDen));  
	 
	return prodFm;  
}  
 
double * taylorWindow(unsigned N, unsigned NBAR, double SLL) { 
	   
	printf("\n CALCULATING TAYLOR WINDOW . . . . . . \n\n");  
	unsigned i, j, k[N];  
	double A, SP2, Xi[N], Fm[i], sum[N], summation = 0.0, *W = NULL;  
	 
	W = (double*) calloc(N, sizeof(double));  
	if (SLL > 0) {
		SLL = -1 * SLL;
	}
	 
	A = acosh(pow(10, -SLL / 20)) / PI;	 
	SP2 = (NBAR * NBAR) / ((A * A + (NBAR - 0.5) * (NBAR - 0.5)));
	 
	if (NBAR < (2 * pow(A, 2) + 0.5)) {  
		printf( "WARNING! Your SSL value does not satisfy the condition NBAR >= 2*A^2+0.5 !\n");
	}
	 
	/******************************************************************
	*           INITIALIZE THE CONTAINERS
	* *****************************************************************/
	 
	for (i = 0; i < N; i++) {
	 	W[i] = 1.0;		 
		k[i] = i;		 
		Xi[i] = (k[i] - 0.5 * N + 0.5) / N;	 
	}
	 
	for (i = 0; i < NBAR - 1; i++) {		 
		Fm[i] = calculateFm((i + 1), SP2, A, NBAR); 
	}
	 
	/******************************************************************
	* CALCULATE THE WINDOW VALUES
	* *****************************************************************/
	 
	for (i = 0; i < N; i++) {
	 
		summation = 0.0;	 
		for (j = 1; j < NBAR; j++) {		 
			/* summation = Fm(m)*cos(2*pi*m*xi)+summation; */
			summation = summation + Fm[j - 1] * cos(2 * PI * j * Xi[i]);		 
		}
		 
		sum[i] = summation;		 
		W[i] = W[i] + 2 * sum[i];  // RETURN THIS TO fir1		 
	}
	 
	return W;
	 
	printf("\n DONE CALCULATING TAYLOR WINDOW \n\n");
}
 
// Main function to test the TaylorWindow function
int main() { 
	unsigned i, N, NBAR;	 
	int A;	 
	double *ww;	 
	 
	printf("Enter the number of points (N)- 51: "); 
	scanf("%d", &N); 
	printf("\n Enter PSLR (A) in db: (-80)"); 
	scanf("%d", &A); 
	printf("\n Enter the number of terms- side lobes (n'): (4)"); 
	scanf("%d", &NBAR);
	 
	ww = (double *) malloc(sizeof(double) * N); 
	ww = taylorWindow(N, NBAR, A); 
	for (i = 0; i < N; i++) 
		printf("\nW[%d]= %f", i, ww[i]);
	 
	printf("\n"); 

	free(ww); 
	return 0; 
}