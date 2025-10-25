import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, recipe-finder');
  });

  it('should correctly classify operators and terms in parse tree', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // Test query with all types of operators and terms
    const testQuery = 'NOT (italian OR french) AND chicken';
    const parseTree = app.generateLocalParseTree(testQuery);

    expect(parseTree).toBeTruthy();
    expect(parseTree?.type).toBe('BooleanQuery');

    // Check that operators are correctly identified
    const expectedOperators = ['NOT', '(', 'OR', ')', 'AND'];
    expect(parseTree?.operators).toEqual(expectedOperators);

    // Check that terms are correctly identified (should not contain operators)
    const expectedTerms = ['italian', 'french', 'chicken'];
    expect(parseTree?.terms).toEqual(expectedTerms);

    // Ensure operators are not in terms
    expectedOperators.forEach(operator => {
      expect(parseTree?.terms).not.toContain(operator);
    });

    // Ensure terms are not in operators
    expectedTerms.forEach(term => {
      expect(parseTree?.operators).not.toContain(term);
    });
  });

  it('should handle complex queries with multiple parentheses and NOT operators', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // Complex query with multiple operators
    const testQuery = '(beef OR pork) AND NOT (quick OR easy)';
    const parseTree = app.generateLocalParseTree(testQuery);

    expect(parseTree).toBeTruthy();

    // Check operators
    const expectedOperators = ['(', 'OR', ')', 'AND', 'NOT', '(', 'OR', ')'];
    expect(parseTree?.operators).toEqual(expectedOperators);

    // Check terms
    const expectedTerms = ['beef', 'pork', 'quick', 'easy'];
    expect(parseTree?.terms).toEqual(expectedTerms);

    // Verify boolean flags
    expect(parseTree?.hasParentheses).toBe(true);
    expect(parseTree?.hasNot).toBe(true);
  });
});
