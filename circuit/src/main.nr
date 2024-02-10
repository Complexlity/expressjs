global N = 9;
global N2= 81;


//checks the lines of the solution are valid
fn check_line(a: [u4;N2]) -> bool
{
    for i in 0..N {
      let mut line = [0;N];
        for j in 0..N {
          line[j] = a[N*i+j];
        };
      check_cards(line);
    };
 true
}


//checks the columns of the solution are valid
fn check_column(a: [u4;N2]) -> bool
{
    for j in 0..9 {
        let mut col = [0;N];
        for i in 0..N {
          col[i] = a[N*i+j];
        };
        check_cards(col);
    };
 true
}


//checks the squares of the solution are valid
fn check_square(a: [u4;N2]) -> bool
{
  let N3 = N / 3;
  for i in 0..N3 {
    for j in 0..N3 {
      let mut square = [0;N];
      for u in 0..N3 {
        for v in 0..N3 {
          square[N3*u+v] =a[N*(N3*i+u)+N3*j+v];
        };
      };
      check_cards(square);
    };
  };
 true
}



fn check_cards(a: [u4;N]) {
  check_cards_best(a);
}

//best (but not optimal) version
fn check_cards_best(a: [u4;N])
{
    let mut s : Field = 0;
    for k in 1..N+1 {
        let mut p : Field = 1;
  	    for j in 0..N {
          p = p * (k -  a[j] as Field);
        };
        s = s + p;
    };

    let mut p : Field = 1;
    for j in 0..N-1 {
        p = p * (a[j] as Field);
    };
    assert(p != 0);
    assert(s == 0);
}

//basic version
fn check_cards_base(a: [u4;9])
{
  for i in 0..9 {
      assert(!((a[i] <1 )| (a[i]>9)));
      for k in 0..i {
          assert(a[k] != a[i]);
      };
  };
}

//using sort
fn check_cards_sort(a: [u4;9])
{
  assert(sort(a) == [1,2,3,4,5,6,7,8,9]);
}

//without comparisons
fn check_cards_plus(a: [u4;N])
{
  let mut s = 0 as Field;
  for i in 0..N {
      assert(a[i] != 0);
      for k in 0..i {
          assert(a[k] != a[i]);
      };
      s = s + a[i] as Field;
  };
  assert(s == 45);
}

//using sumcheck
fn check_cards_sc(a: [u4;9])
{
    let mut s : Field = 0;
    for k in 1..10 {
        let mut p : Field = 1;
  	    for j in 0..9 {
          p = p * (k -  a[j] as Field);
        };
        s = s + p;
    };
    for j in 0..9 {
        assert(a[j] != 10);
    };
    assert(s == 0);
}


fn sort(mut a: [u4;9]) -> [u4;9] {
    //std::array::sort(a)
    for i in 1..N {
        for j in 0..i {
            if(a[i] < a[j]) {
                let c = a[j];
                a[j] = a[i];
                a[i]= c;
            }
        };
    };
    a
}

fn main(solution:[u4;81]) {
 assert(check_line(solution) & check_square(solution)  & check_column(solution));
}

#[test]
fn test_main() {
  let solution_correct = [8,9,3,7,2,5,4,6,1,4,7,2,3,6,1,5,8,9,1,6,5,4,8,9,3,2,7,9,5,7,6,4,8,2,1,3,6,3,1,5,7,2,8,9,4,2,4,8,9,1,3,6,7,5,5,2,9,8,3,7,1,4,6,7,8,4,1,5,6,9,3,2,3,1,6,2,9,4,7,5,8];
    main(solution_correct);
}

#[test(should_fail)]
fn test_fail_main() {
  let solution_incorrect = [8,8,3,7,2,5,4,6,1,4,7,2,3,6,1,5,8,9,1,6,5,4,8,9,3,2,7,9,5,7,6,4,8,2,1,3,6,3,1,5,7,2,8,9,4,2,4,8,9,1,3,6,7,5,5,2,9,8,3,7,1,4,6,7,8,4,1,5,6,9,3,2,3,1,6,2,9,4,7,5,8];
    main(solution_incorrect);
}